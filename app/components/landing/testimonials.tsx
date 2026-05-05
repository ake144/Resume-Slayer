import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

export function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "I was getting auto-rejected before using Resume Slayer. The ATS visualizer fixed my formatting, and I landed 3 FAANG interviews in two weeks.",
      name: "Sarah Chen",
      designation: "Senior Software Engineer",
      src: "https://api.dicebear.com/9.x/micah/svg?seed=Sarah&backgroundColor=transparent",
    },
    {
      quote:
        "The Upwork proposal generator is a sheer cheat code. My client response rate went from 10% to over 60% almost overnight. It's actually absurd.",
      name: "Michael Rodriguez",
      designation: "Freelance Full-Stack Developer",
      src: "https://api.dicebear.com/9.x/micah/svg?seed=Michael&backgroundColor=transparent",
    },
    {
      quote:
        "Slay Mode's skill roadmap gave me exactly what I needed to bridge my knowledge gaps. Just signed a Product Manager offer with a 40% pay bump.",
      name: "Emily Watson",
      designation: "Product Manager",
      src: "https://api.dicebear.com/9.x/micah/svg?seed=Emily&backgroundColor=transparent",
    },
    {
      quote:
        "Finally, a resume tool that understands what elite tech recruiters look for. The cold pitch templates got me directly in touch with hiring managers.",
      name: "James Kim",
      designation: "Data Scientist",
      src: "https://api.dicebear.com/9.x/micah/svg?seed=James&backgroundColor=transparent",
    },
    {
      quote:
        "I had the skills but couldn't get past the automated screeners. The ATS optimizer pinpointed exactly what was missing. My interview pipeline is completely full now.",
      name: "Lisa Thompson",
      designation: "UI/UX Designer",
      src: "https://api.dicebear.com/9.x/micah/svg?seed=Lisa&backgroundColor=transparent",
    },
  ];
  
  return (
    <section className="py-24 bg-[#050505] relative overflow-hidden" id="success">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-blue-600/5 rounded-full blur-[120px]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Don't just take our word for it
          </h2>
          <p className="text-gray-400 text-lg">
            Join thousands of professionals who are slaying their job search and freelance pipeline.
          </p>
        </div>
        
        <AnimatedTestimonials testimonials={testimonials} />
      </div>
    </section>
  );
}
