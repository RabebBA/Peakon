/*import { dbConnection } from '../src/database';
import { RoleModel } from '../src/models/role.model';
import { UserModel } from '../src/models/users.model';
import { WorkflowTemplate } from '../src/models/WorkflowTemplate';
import bcrypt from 'bcryptjs';

const seed = async () => {
  await dbConnection();

  // RoleModels
  const roles = await RoleModel.insertMany([
    { name: 'admin', permissions: ['*'] },
    { name: 'project_owner', permissions: ['project:write'] },
    { name: 'developer', permissions: ['task:write'] },
  ]);

  // Admin user
  const hashedPassword = await bcrypt.hash('Admin123!', 12);
  await UserModel.create({
    email: 'admin@projectflow.com',
    password: hashedPassword,
    roles: [roles[0]._id],
    verified: true,
  });

  // Workflow templates
  await WorkflowTemplate.insertMany([
    {
      name: 'Workflow Agile Standard',
      description: 'Workflow par défaut pour les projets Agile',
      statuses: ['Backlog', 'En cours', 'En revue', 'Terminé'],
      transitions: [
        { from: 'Backlog', to: 'En cours', roles: ['developer'] },
        { from: 'En cours', to: 'En revue', roles: ['developer'] },
        { from: 'En revue', to: 'Terminé', roles: ['project_owner'] },
      ],
    },
  ]);

  console.log('✅ Seed initial terminé avec succès');
  process.exit(0);
};

seed().catch(err => {
  console.error('❌ Erreur lors du seed:', err);
  process.exit(1);
});

/*Commande d'exécution:   docker exec projectflow_api npm run ts-node ./scripts/seed.ts*/
