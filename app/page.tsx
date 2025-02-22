"use client"

import { useState, useEffect } from "react"
import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Tag, Loader2 } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface NewsArticle {
  topic: string
  title: string
  slug: string
  content: string
}

export default function Home() {
  const [topic, setTopic] = useState("")
  const [news, setNews] = useState<NewsArticle[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const searchParams = useSearchParams()
  const searchTerm = searchParams.get("search") || ""
  const { toast } = useToast()

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/`)
      const data = await response.json()
      setNews(data)
    } catch (error) {
      console.error("Error fetching news:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch news articles",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generateNews = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate_news/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      })

      toast({
        title: "News Generated!",
        description: "Refreshing to show latest content...",
      })

      // Auto refresh after 2 seconds
      setTimeout(() => {
        fetchNews()
      }, 2000)

      setTopic("")
    } catch (error) {
      console.error("Error generating news:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate news",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const truncateContent = (content: string, wordCount = 15) => {
    const words = content.split(" ")
    if (words.length > wordCount) {
      return words.slice(0, wordCount).join(" ") + "..."
    }
    return content
  }

  const filteredNews = news.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.slug.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto py-6 px-4">
      {/* News Generation Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Generate AI News</CardTitle>
          <CardDescription>Enter a topic to generate AI-powered news content</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={generateNews} className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Enter news topic..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
              className="flex-1"
            />
            <Button type="submit" disabled={isGenerating} className="min-w-[120px]">
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating
                </>
              ) : (
                "Generate News"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* News Display */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredNews.map((article, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <CardDescription>{article.topic}</CardDescription>
                </div>
                <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
                  <Link href={`/news/${article.slug}`}>{article.title}</Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{truncateContent(article.content)}</p>
              </CardContent>
              <CardFooter className="mt-auto pt-4">
                <Link href={`/news/${article.slug}`} className="w-full">
                  <Button variant="secondary" className="w-full">
                    Read More
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      <Toaster />
    </div>
  )
}

