import {
  type User,
  type InsertUser,
  type Project,
  type InsertProject,
  type RankingResult,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;

  getRankings(projectId: string): Promise<RankingResult[]>;
  getLatestRanking(projectId: string): Promise<RankingResult | undefined>;
  saveRanking(ranking: Omit<RankingResult, "id">): Promise<RankingResult>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private projects: Map<string, Project>;
  private rankings: Map<string, RankingResult[]>;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.rankings = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = {
      ...insertProject,
      id,
      keywords: insertProject.keywords || [],
      competitors: insertProject.competitors || [],
      status: insertProject.status || "draft",
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(
    id: string,
    updates: Partial<InsertProject>
  ): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;

    const updatedProject: Project = {
      ...project,
      ...updates,
    };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }

  async getRankings(projectId: string): Promise<RankingResult[]> {
    return this.rankings.get(projectId) || [];
  }

  async getLatestRanking(projectId: string): Promise<RankingResult | undefined> {
    const projectRankings = this.rankings.get(projectId) || [];
    if (projectRankings.length === 0) return undefined;
    return projectRankings[projectRankings.length - 1];
  }

  async saveRanking(ranking: Omit<RankingResult, "id">): Promise<RankingResult> {
    const id = randomUUID();
    const newRanking: RankingResult = { ...ranking, id };
    
    const projectRankings = this.rankings.get(ranking.projectId) || [];
    projectRankings.push(newRanking);
    this.rankings.set(ranking.projectId, projectRankings);
    
    return newRanking;
  }
}

export const storage = new MemStorage();
