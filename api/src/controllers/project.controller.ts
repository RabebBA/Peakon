import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { IProject } from '@interfaces/project.interface';
import { ProjectService } from '@services/project.service';
import { RequestWithUser } from '@/interfaces/auth.interface';

export class ProjectController {
  public project = Container.get(ProjectService);

  public getProjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllProjectsData: IProject[] = await this.project.findAllProject();

      res.status(200).json({ data: findAllProjectsData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getProjectById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectId: string = req.params.id;
      const findOneProjectData: IProject = await this.project.findProjectById(projectId);

      res.status(200).json({ data: findOneProjectData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createProject = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const projectData: IProject = req.body;
      const createProjectData: IProject = await this.project.createProject(userId, projectData);

      res.status(201).json({ data: createProjectData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateProject = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const projectId: string = req.params.id;
      const projectData: IProject = req.body;
      const updateProjectData: IProject = await this.project.updateProject(userId, projectId, projectData);

      res.status(200).json({ data: updateProjectData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectId: string = req.params.id;
      const deleteProjectData: IProject = await this.project.deleteProject(projectId);

      res.status(200).json({ data: deleteProjectData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  public getProjectWorkflow = async (req: Request, res: Response) => {
    try {
      const workflow = await ProjectService.getWorkflow(req.params.id);
      res.json(workflow);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}
