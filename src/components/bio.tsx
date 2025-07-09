
import Image from 'next/image'
import Link from 'next/link'
import { Github, Linkedin, Instagram } from 'lucide-react'
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
          김정환의 개발 성장 Log
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          백엔드 개발자를 지망하며 웹의 세계를 탐험하는 여정을 기록합니다.
          <br />
          기술의 깊이를 더하고, 성장의 발자취를 공유하는 공간입니다.
        </p>
        
        {/* Social Links */}
        <div className="mt-6 flex justify-center md:justify-start space-x-4">
          <Link href="#" passHref>
            <Button variant="ghost" size="icon" aria-label="GitHub">
              <Github className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="#" passHref>
            <Button variant="ghost" size="icon" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="https://instagram.com" passHref>
            <Button variant="ghost" size="icon" aria-label="Instagram">
              <Instagram className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
