import { Response, NextFunction } from 'express';
import { PrivilegeModel } from '@/models/privilege.model';
import { UserRoleModel } from '@/models/user.role.model';
import { HttpException } from '@/exceptions/httpException';
import { RequestWithUser } from '@/interfaces/auth.interface';

export const checkPermission = (action: 'create' | 'read' | 'readAll' | 'update' | 'delete') => {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      const projectId = req.headers['x-project-id']; // ID du projet (peut être envoyé dans le header)

      if (!userId) {
        throw new HttpException(401, 'Unauthorized: No user ID provided');
      }
      if (!projectId) {
        throw new HttpException(400, 'Bad Request: Project ID is required');
      }

      const routePath = req.baseUrl + req.route.path; // Récupérer le chemin de la route actuelle

      // Vérifier si l'utilisateur a un privilège direct sur cette route
      const userPrivilege = await PrivilegeModel.findOne({
        userId,
        projectId,
        routeId: req.route.path,
        [action]: true,
      });

      if (userPrivilege) {
        return next(); // L'utilisateur a le droit d'accès
      }

      // Récupérer les rôles de l'utilisateur pour ce projet
      const userRoles = await UserRoleModel.findOne({ userId, projectId }).populate('roleId');

      if (!userRoles || userRoles.roleId.length === 0) {
        throw new HttpException(403, 'Forbidden: No role assigned in this project');
      }

      // Vérifier si l'un des rôles de l'utilisateur a le privilège nécessaire
      const rolePrivileges = await PrivilegeModel.findOne({
        roleId: { $in: userRoles.roleId },
        projectId,
        routeId: req.route.path,
        [action]: true,
      });

      if (rolePrivileges) {
        return next(); // L'utilisateur a le droit via son rôle
      }

      throw new HttpException(403, "Forbidden: You don't have permission to perform this action");
    } catch (error) {
      next(error);
    }
  };
};
