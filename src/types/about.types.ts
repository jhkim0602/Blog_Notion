export interface SocialLinks {
  github: string;
  email: string;
  linkedin: string;
}

export interface Profile {
  name: string;
  title: string;
  bio: string;
  location: string;
  avatar: string;
  social: SocialLinks;
}

export interface WorkExperience {
  company: string;
  companyUrl: string;
  period: string;
  position: string;
  responsibilities: string[];
}

export interface Education {
  school: string;
  period: string;
  major: string;
}

export interface AboutContent {
  profile: Profile;
  workExperience: WorkExperience[];
  education: Education[];
  skills: string[];
}
