import { createServer, Model, Response } from "miragejs";
import localforage from "localforage";

export function makeServer() {
  return createServer({
    models: {
      user: Model,
      job: Model,
      candidate: Model,
      assessment: Model,
    },
    seeds: async function(server) {
      // ===== USERS =====
      server.create("user", {
        id: "r1",
        role: "recruiter",
        email: "recruiter@talentflow.com",
        password: "recruiter123",
        name: "HR Recruiter",
      });
      server.create("user", {
        id: "c1",
        role: "candidate",
        email: "candidate@talentflow.com",
        password: "candidate123",
        name: "John Doe",
      });

      // ===== JOBS =====
      // Always create jobs regardless of IndexedDB state
      const companies = ["Google", "Amazon", "Microsoft", "Meta", "Netflix", "IBM", "Uber", "Atlassian"];
      const positions = ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Product Manager", "DevOps Engineer", "Data Scientist", "UI/UX Designer", "QA Engineer"];
      const skillsList = ["React,JavaScript,HTML,CSS", "Node.js,Express,REST", "Python,Machine Learning,SQL", "AWS,Docker,Kubernetes", "Figma,UI/UX,Prototyping", "Java,Spring Boot,MySQL", "Vue.js,TypeScript,GraphQL", "Selenium,Jest,Testing"];
      const experiences = ["Fresher", "Intermediate", "Experienced"];
      for (let i = 1; i <= 25; i++) {
        server.create("job", {
          id: `j${i}`,
          title: `Job ${i}`,
          slug: `job-${i}`,
          status: i % 2 === 0 ? "active" : "archived",
          tags: ["tag1", "tag2", "tag3"].slice(0, (i % 3) + 1),
          order: i,
          description: `Description for Job ${i}`,
          companyName: companies[i % companies.length],
          jobPosition: positions[i % positions.length],
          skillsRequired: skillsList[i % skillsList.length],
          experienceRequired: experiences[i % experiences.length],
          salary: `${70 + i} LPA`,
        });
      }

      // ===== ASSESSMENTS =====
      for (let a = 1; a <= 3; a++) {
        server.create("assessment", {
          id: `a${a}`,
          jobId: `j${a}`, // Assign to a job
          title: `Assessment ${a}`,
          description: `This is a sample assessment for Job ${a}`,
          sections: [
            {
              title: "Technical Questions",
              questions: Array.from({ length: 5 }, (_, q) => ({
                text: `Question ${q + 1} for Assessment ${a}`,
                type: ["single-choice", "multi-choice", "short-text", "long-text", "numeric-range"][q % 5],
                required: Math.random() > 0.3,
                options: ["A", "B", "C", "D"],
                min: 0,
                max: 100
              }))
            },
            {
              title: "General Questions",
              questions: Array.from({ length: 3 }, (_, q) => ({
                text: `General Question ${q + 1}`,
                type: ["short-text", "long-text", "single-choice"][q % 3],
                required: true,
                options: ["Yes", "No", "Maybe"]
              }))
            }
          ],
          createdAt: new Date().toISOString()
        });
      }

      // ===== CANDIDATES (1000 candidates) =====
      const stages = ["applied", "screen", "tech", "offer", "hired", "rejected"];
      const firstNames = ["John", "Jane", "Michael", "Sarah", "David", "Emily", "Robert", "Lisa", "James", "Mary", "William", "Patricia", "Richard", "Jennifer", "Thomas", "Linda", "Charles", "Barbara", "Daniel", "Elizabeth"];
      const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];
      
      for (let c = 1; c <= 1000; c++) {
        const jobId = `j${(c % 25) + 1}`;
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        
        server.create("candidate", {
          id: `cand${c}`,
          name: `${firstName} ${lastName}`,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${c}@mail.com`,
          jobId,
          stage: stages[Math.floor(Math.random() * stages.length)],
          notes: [],
          appliedDate: new Date(2025, Math.floor(Math.random() * 3), Math.floor(Math.random() * 28) + 1).toISOString(),
        });
      }
    },

    routes() {
      this.namespace = "api";

      // Helper to inject latency & error (move here so it's defined before use)
      const injectLatencyAndError = async (request, handler) => {
        const latency = Math.floor(Math.random() * 1000) + 200; // 200–1200ms
        await new Promise((res) => setTimeout(res, latency));

        if (["post", "put", "patch", "delete"].includes(request.method.toLowerCase())) {
          if (Math.random() < 0.1) {
            return new Response(500, {}, { error: "Artificial server error" });
          }
        }
        return handler();
      };

      // ===== LOGIN =====
      this.post("/login", async (schema, request) => {
        console.log("Login request received");
        return injectLatencyAndError(request, () => {
          const { email, password } = JSON.parse(request.requestBody);
          console.log("Login attempt with:", email, password);
          const user = schema.users.findBy({ email, password });
          if (user) {
            console.log("Login successful for user:", user.attrs);
            return { success: true, user: user.attrs };
          } else {
            console.log("Login failed for:", email);
            return new Response(401, {}, { error: "Invalid email or password" });
          }
        });
      });

      // ===== JOBS =====
      this.get("/jobs", async (schema, request) => {
        let { search, status, page = 1, pageSize = 10, sort } = request.queryParams;
        let jobs = schema.jobs.all().models;

        if (search) {
          jobs = jobs.filter((job) =>
            job.title.toLowerCase().includes(search.toLowerCase())
          );
        }

        if (status) {
          jobs = jobs.filter((job) => job.status === status);
        }

        if (sort) {
          jobs.sort((a, b) =>
            sort === "asc" ? a.order - b.order : b.order - a.order
          );
        }
        const total = jobs.length;
        const start = (page - 1) * pageSize;
        const end = start + Number(pageSize);

        return { jobs: jobs.slice(start, end).map((j) => j.attrs), total };
      });

      this.post("/jobs", async (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const job = schema.jobs.create(attrs);
        return job.attrs;
      });

      this.patch("/jobs/:id", async (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const job = schema.jobs.find(request.params.id);
        const updated = job.update(attrs).attrs;
        return updated;
      });

      this.delete("/jobs/:id", async (schema, request) => {
        const job = schema.jobs.find(request.params.id);
        if (job) {
          job.destroy();
          return new Response(200, {}, { success: true });
        } else {
          return new Response(404, {}, { error: "Job not found" });
        }
      });

      // ===== CANDIDATES =====
      this.get("/candidates", (schema, request) => {
        let { search, stage, page = 1, pageSize = 20 } = request.queryParams;
        let candidates = schema.candidates.all().models;
        if (search) {
          candidates = candidates.filter(
            (c) =>
              c.name.toLowerCase().includes(search.toLowerCase()) ||
              c.email.toLowerCase().includes(search.toLowerCase())
          );
        }
        if (stage) {
          candidates = candidates.filter((c) => c.stage === stage);
        }
        const total = candidates.length;
        const start = (page - 1) * pageSize;
        const end = start + Number(pageSize);

        return { candidates: candidates.slice(start, end).map((c) => c.attrs), total };
      });
      
      this.get("/candidates/:id", (schema, request) => {
        const candidate = schema.candidates.find(request.params.id);
        return candidate ? candidate.attrs : new Response(404, {}, { error: "Candidate not found" });
      });
      
      this.patch("/candidates/:id", async (schema, request) =>
        injectLatencyAndError(request, () => {
          const attrs = JSON.parse(request.requestBody);
          const candidate = schema.candidates.find(request.params.id);
          return candidate.update(attrs).attrs;
        })
      );
      
      this.get("/candidates/:id/timeline", (schema, request) => {
        const candidate = schema.candidates.find(request.params.id);
        // Just a fake timeline for demo
        return {
          timeline: [
            { stage: "applied", date: "2025-01-01" },
            { stage: "screen", date: "2025-01-05" },
            { stage: candidate.stage, date: "2025-01-10" },
          ],
        };
      });
      
      // ===== ASSESSMENTS =====
      this.get("/assessments/:jobId", (schema, request) => {
        console.log("Fetching assessment for jobId:", request.params.jobId);
        const assessment = schema.assessments.findBy({ jobId: request.params.jobId });
        console.log("Found assessment:", assessment ? assessment.attrs : null);
        const result = assessment ? { assessment: assessment.attrs } : { assessment: null };
        console.log("Returning result:", result);
        return result;
      });

      this.put("/assessments/:jobId", async (schema, request) =>
        injectLatencyAndError(request, () => {
          const attrs = JSON.parse(request.requestBody);
          console.log("Saving assessment:", attrs);
          
          // Ensure the assessment has an ID
          if (!attrs.id) {
            attrs.id = `assessment-${attrs.jobId}`;
          }
          
          // Make sure jobId is set
          attrs.jobId = request.params.jobId;
          
          let assessment = schema.assessments.findBy({ jobId: request.params.jobId });
          if (assessment) {
            console.log("Updating existing assessment");
            return assessment.update(attrs).attrs;
          } else {
            console.log("Creating new assessment");
            return schema.assessments.create(attrs).attrs;
          }
        })
      );

      this.post("/assessments/:jobId/submit", async (schema, request) =>
        injectLatencyAndError(request, () => {
          const { responses } = JSON.parse(request.requestBody);
          return { success: true, responses };
        })
      );
      
      // Add a catch-all route for debugging
      this.get("/assessments", (schema) => {
        return schema.assessments.all();
      });
    },
  });
}