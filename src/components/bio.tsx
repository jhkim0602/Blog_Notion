import Image from 'next/image'
import Link from 'next/link'
import { Github, CodeXml, Instagram } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Bio() {
  return (
    <section className="my-12 flex flex-col items-center text-center md:flex-row md:items-start md:text-left">
      {/* Avatar */}
      <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
        <Image
          src="/my-avatar.png" // Using the existing globe icon as a placeholder avatar
          alt="Profile Avatar"
          width={100} // Increased size for more impact
          height={100}
          className="rounded-full border-2 border-primary/50 shadow-lg"
        />
      </div>

      {/* Text Content */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          정환이의 개발블로그
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          안녕하세요.
          <br />
          문제를 해결하는 것보다, 문제의 구조를 이해하는 것을 더 좋아합니다.
        </p>
        {/* Social Links */}
        <div className="mt-6 flex justify-center md:justify-start space-x-4">
          <Link href="https://github.com/jhkim0602" passHref>
            <Button variant="ghost" size="icon" aria-label="GitHub">
              <Github className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="https://www.acmicpc.net/user/jhkim030602" passHref>
            <Button variant="ghost" size="icon" aria-label="baekjoon">
              <CodeXml className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="https://www.instagram.com/j_jhwan?igsh=bngzdGU5cWtrdDF3&utm_source=qr" passHref>
            <Button variant="ghost" size="icon" aria-label="Instagram">
              <Instagram className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
