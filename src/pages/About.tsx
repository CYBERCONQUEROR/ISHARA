import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  HandHeart, 
  Globe, 
  Users, 
  Target, 
  Lightbulb, 
  BadgeCheck, 
  BookOpen,
  Route,
  Award,
  Languages,
  Accessibility
} from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-ishara-gradient rounded-2xl p-12 mb-12 text-white text-center">
          <h1 className="text-4xl font-bold mb-6">About Ishara</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Breaking communication barriers between deaf and hearing communities through innovative Indian Sign Language translation technology.
          </p>
        </div>

        {/* Our Mission */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We envision a world where communication barriers no longer limit potential, where every conversation, every opportunity, and every dream is accessible to all.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg text-center">
              <CardContent className="p-8">
                <HandHeart className="h-12 w-12 text-ishara-blue mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Inclusion</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Creating technology that brings deaf and hearing communities together through seamless communication.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg text-center">
              <CardContent className="p-8">
                <Globe className="h-12 w-12 text-ishara-teal mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Preservation</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Documenting and preserving the rich cultural heritage and linguistic diversity of Indian Sign Language.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg text-center">
              <CardContent className="p-8">
                <Users className="h-12 w-12 text-ishara-orange mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Empowerment</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Enabling independence and equal access to education, employment, and social opportunities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Meet the Team Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Meet the Team</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              The passionate individuals behind ISHARA's mission.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="relative bg-white dark:bg-gray-800/70 rounded-2xl p-8 shadow-xl border-2 border-transparent bg-clip-padding group hover:border-cyan-400 transition-all duration-300">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold shadow-lg ring-2 ring-cyan-300">Founder & CEO</span>
              </div>
              <img src="/1703060891503-01.jpeg" alt="Founder" className="w-40 h-40 mx-auto rounded-full object-cover shadow-lg ring-4 ring-cyan-400 group-hover:ring-blue-500 transition-all duration-300 mb-4 mt-6" />
              <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1 tracking-tight">Krishnav Talukdar</h3>
              <p className="text-cyan-500 font-semibold mb-3 text-lg">Founder & CEO</p>
              <p className="text-gray-600 dark:text-gray-300 text-base">
                A visionary leader with a passion for leveraging technology to create a more inclusive world for the deaf community.
              </p>
            </div>
            <div className="relative bg-white dark:bg-gray-800/70 rounded-2xl p-8 shadow-xl border-2 border-transparent bg-clip-padding group hover:border-teal-400 transition-all duration-300">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-teal-400 to-green-400 text-white text-xs font-bold shadow-lg ring-2 ring-teal-300">Co-Founder & CTO</span>
              </div>
              <img src="/1745341270888.jpeg" alt="Co-Founder" className="w-40 h-40 mx-auto rounded-full object-cover shadow-lg ring-4 ring-teal-400 group-hover:ring-green-400 transition-all duration-300 mb-4 mt-6" />
              <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1 tracking-tight">Karan Singh Negi</h3>
              <p className="text-teal-500 font-semibold mb-3 text-lg">Co-Founder & CTO</p>
              <p className="text-gray-600 dark:text-gray-300 text-base">
                The technical architect behind our cutting-edge sign language translation technology, dedicated to building accessible solutions.
              </p>
            </div>
          </div>
        </div>
        
        {/* Why ISL Matters */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why Indian Sign Language Matters</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              ISL is a complete, natural language with its own grammar, syntax, and cultural significance, serving as the primary mode of communication for millions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <BadgeCheck className="h-6 w-6 text-ishara-blue" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">A Recognized Language</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    ISL was officially recognized as a language in India in 2017, acknowledging its importance for the deaf community.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-teal-100 p-3 rounded-full">
                  <Languages className="h-6 w-6 text-ishara-teal" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Linguistic Diversity</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    ISL has regional variations across India's states, reflecting the country's rich linguistic diversity.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-orange-100 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-ishara-orange" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Cultural Heritage</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Beyond communication, ISL carries cultural values, stories, and traditions of the deaf community.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-ishara-blue/5 p-8 rounded-2xl">
              <h3 className="text-xl font-semibold mb-4">ISL in Numbers</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-ishara-blue mb-1">60M+</div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Deaf & Hard-of-Hearing Indians</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-ishara-teal mb-1">325</div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Certified ISL Interpreters</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-ishara-orange mb-1">5%</div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Have Access to Technology</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-1">23</div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Regional Variations</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Approach - Modern Timeline */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Approach</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Ishara combines cutting-edge technology with deep respect for ISL and the deaf community's unique needs.
            </p>
          </div>
          <div className="relative max-w-3xl mx-auto">
            {/* Vertical timeline line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 via-teal-400 to-orange-400 rounded-full -translate-x-1/2 z-0"></div>
            <div className="space-y-16 relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col md:flex-row items-center md:items-stretch relative">
                <div className="flex flex-col items-center md:w-1/2 md:pr-8">
                  <div className="bg-cyan-500 text-white rounded-full w-14 h-14 flex items-center justify-center text-2xl font-bold shadow-lg mb-4 animate-bounce">
                    1
                  </div>
                  <div className="bg-white dark:bg-gray-800/80 rounded-xl shadow-lg p-6 w-full">
                    <div className="flex items-center mb-3">
                      <span className="inline-block bg-cyan-100 dark:bg-cyan-900 p-3 rounded-full mr-3">
                        <Lightbulb className="h-8 w-8 text-cyan-500" />
                      </span>
                      <h3 className="text-xl font-bold text-cyan-600 dark:text-cyan-400">Technology with Purpose</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">
                      We develop AI models specifically trained on Indian Sign Language, recognizing its unique grammar and regional variations.
                    </p>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li className="flex items-center"><BadgeCheck className="h-4 w-4 text-cyan-500 mr-2" />High-accuracy gesture recognition</li>
                      <li className="flex items-center"><BadgeCheck className="h-4 w-4 text-cyan-500 mr-2" />Real-time processing</li>
                      <li className="flex items-center"><BadgeCheck className="h-4 w-4 text-cyan-500 mr-2" />Privacy-preserving design</li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* Step 2 */}
              <div className="flex flex-col md:flex-row items-center md:items-stretch relative">
                <div className="flex flex-col items-center md:w-1/2 md:pl-8 md:order-2 md:text-right">
                  <div className="bg-teal-500 text-white rounded-full w-14 h-14 flex items-center justify-center text-2xl font-bold shadow-lg mb-4 animate-bounce">
                    2
                  </div>
                  <div className="bg-white dark:bg-gray-800/80 rounded-xl shadow-lg p-6 w-full">
                    <div className="flex items-center mb-3 justify-end">
                      <h3 className="text-xl font-bold text-teal-600 dark:text-teal-400 mr-3">Community-Driven Development</h3>
                      <span className="inline-block bg-teal-100 dark:bg-teal-900 p-3 rounded-full">
                        <Users className="h-8 w-8 text-teal-500" />
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">
                      We collaborate closely with the deaf community, ISL interpreters, and educators to ensure our solutions address real needs.
                    </p>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li className="flex items-center justify-end"><span>Deaf-led research and testing</span><BadgeCheck className="h-4 w-4 text-teal-500 ml-2" /></li>
                      <li className="flex items-center justify-end"><span>Cultural sensitivity and relevance</span><BadgeCheck className="h-4 w-4 text-teal-500 ml-2" /></li>
                      <li className="flex items-center justify-end"><span>Regular user feedback implementation</span><BadgeCheck className="h-4 w-4 text-teal-500 ml-2" /></li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* Step 3 */}
              <div className="flex flex-col md:flex-row items-center md:items-stretch relative">
                <div className="flex flex-col items-center md:w-1/2 md:pr-8">
                  <div className="bg-orange-500 text-white rounded-full w-14 h-14 flex items-center justify-center text-2xl font-bold shadow-lg mb-4 animate-bounce">
                    3
                  </div>
                  <div className="bg-white dark:bg-gray-800/80 rounded-xl shadow-lg p-6 w-full">
                    <div className="flex items-center mb-3">
                      <span className="inline-block bg-orange-100 dark:bg-orange-900 p-3 rounded-full mr-3">
                        <Globe className="h-8 w-8 text-orange-500" />
                      </span>
                      <h3 className="text-xl font-bold text-orange-600 dark:text-orange-400">Holistic Ecosystem</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">
                      We go beyond translation to create a comprehensive platform for learning, connecting, and advocating.
                    </p>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li className="flex items-center"><span>ISL education and resources</span><BadgeCheck className="h-4 w-4 text-orange-500 ml-2" /></li>
                      <li className="flex items-center"><span>Community building features</span><BadgeCheck className="h-4 w-4 text-orange-500 ml-2" /></li>
                      <li className="flex items-center"><span>Awareness and advocacy tools</span><BadgeCheck className="h-4 w-4 text-orange-500 ml-2" /></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accessibility Commitment */}
        <Card className="border-none shadow-lg mb-16 bg-gray-50">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
              <div className="bg-ishara-gradient rounded-full p-6 text-white">
                <Accessibility className="h-12 w-12" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Our Accessibility Commitment</h2>
                <p className="text-gray-700 dark:text-gray-400 mb-4">
                  Ishara is built with accessibility at its core. We adhere to WCAG 2.1 AA standards and continuously work to ensure our platform is usable by everyone, regardless of ability.
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <li className="flex items-center">
                    <BadgeCheck className="h-4 w-4 text-ishara-blue mr-2" />
                    <span>Screen reader compatibility</span>
                  </li>
                  <li className="flex items-center">
                    <BadgeCheck className="h-4 w-4 text-ishara-blue mr-2" />
                    <span>Keyboard navigation</span>
                  </li>
                  <li className="flex items-center">
                    <BadgeCheck className="h-4 w-4 text-ishara-blue mr-2" />
                    <span>High contrast modes</span>
                  </li>
                  <li className="flex items-center">
                    <BadgeCheck className="h-4 w-4 text-ishara-blue mr-2" />
                    <span>Text resizing support</span>
                  </li>
                  <li className="flex items-center">
                    <BadgeCheck className="h-4 w-4 text-ishara-blue mr-2" />
                    <span>Alternative text for images</span>
                  </li>
                  <li className="flex items-center">
                    <BadgeCheck className="h-4 w-4 text-ishara-blue mr-2" />
                    <span>Captions for all videos</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Team</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Ishara brings together a diverse team of deaf and hearing professionals with expertise in AI, linguistics, education, and accessibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg text-center">
              <CardContent className="p-8">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold">Deepak Sharma</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">Founder & CEO</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  CODA (Child of Deaf Adult) with 15+ years in accessibility technology
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg text-center">
              <CardContent className="p-8">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold">Priya Mehta</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">Head of ISL Research</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Deaf educator and ISL linguist with PhD in Sign Language Studies
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg text-center">
              <CardContent className="p-8">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold">Raj Patel</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">Lead AI Engineer</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Computer vision specialist with expertise in gesture recognition
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Partners & Supporters */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Partners & Supporters</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We're grateful to work with organizations committed to accessibility and inclusion.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="h-24 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400 font-semibold">Partner 1</span>
            </div>
            <div className="h-24 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400 font-semibold">Partner 2</span>
            </div>
            <div className="h-24 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400 font-semibold">Partner 3</span>
            </div>
            <div className="h-24 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400 font-semibold">Partner 4</span>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-ishara-gradient rounded-2xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Whether you're deaf, hard-of-hearing, or a hearing ally, there's a place for you in the Ishara community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-white text-ishara-blue hover:bg-gray-100">
              Contact Us
            </Button>
            <Button variant="outline" className="text-white border-white hover:bg-white/20">
              Join Community
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default About;
