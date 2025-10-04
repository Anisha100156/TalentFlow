import { Briefcase, Code, User } from "lucide-react";

export const AboutSection = () => {
  return (
    <section id="about" className="py-24 px-4 relative">
      {" "}
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          About <span className="text-primary"> TalentFlow</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            

           

            <h4 className="text-muted-foreground">
               TalentFlow is a mini hiring platform designed to simplify recruitment for HR teams while providing a smooth, transparent experience for candidates.Built entirely in React, TalentFlow simulates a real-world hiring environment without the need for a backend.
            </h4>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
              <a href="#hero" className="cosmic-button">
                {" "}
                Explore
              </a>

             
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
           
            <div className="gradient-border p-6 card-hover">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-lg">Candidate</h4>
                  <p className="text-muted-foreground">
                   Apply, track, and complete assessments effortlessly. Browse and apply to multiple jobs, follow your progress with a clear timeline, and complete interactive quizzes with validation and conditional questions.
                  </p>
                </div>
              </div>
            </div>
            <div className="gradient-border p-6 card-hover">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>

                <div className="text-left">
                  <h4 className="font-semibold text-lg">Recruiter</h4>
                  <p className="text-muted-foreground">
                   Manage jobs, track candidates, and build assessments seamlessly. Create, edit, archive, and reorder job postings with smart filtering. Move candidates through stages via a Kanban board, attach notes, and view timelines. Design job-specific quizzes and forms with multiple question types and live previews.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
