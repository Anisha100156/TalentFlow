import Dexie from "dexie";

export const db = new Dexie("TalentFlowDB");

db.version(1).stores({
  users: "id,role,email,name",
  jobs: "id,title,slug,status,order",
  candidates: "id,name,email,stage,jobId",
  assessments: "id,jobId,title,createdAt"
});

// Helper functions
export async function persistToDB(resource, data) {
  console.log(`Persisting to DB: ${resource}`, data);
  switch(resource) {
    case "jobs": await db.jobs.put(data); break;
    case "candidates": await db.candidates.put(data); break;
    case "assessments": await db.assessments.put(data); break;
    case "users": await db.users.put(data); break;
    default: break;
  }
}

export async function loadFromDB(resource) {
  console.log(`Loading from DB: ${resource}`);
  switch(resource) {
    case "jobs": return await db.jobs.toArray();
    case "candidates": return await db.candidates.toArray();
    case "assessments": return await db.assessments.toArray();
    case "users": return await db.users.toArray();
    default: return [];
  }
}

// Assessment specific functions
export async function getAssessmentByJobId(jobId) {
  console.log(`Getting assessment for jobId: ${jobId}`);
  const result = await db.assessments.where("jobId").equals(jobId).first();
  console.log("Found assessment:", result);
  return result;
}

export async function saveAssessment(assessment) {
  console.log("Saving assessment to DB:", assessment);
  return await db.assessments.put(assessment);
}