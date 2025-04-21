import { App } from '@/app';
import { ValidateEnv } from '@utils/validateEnv';

import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/users.route';
import { PrivilegeRoute } from '@/routes/privilege.route';
import { RoleRoute } from './routes/role.route';
import { RouteRoute } from './routes/route.route';
import { UserRoleRoute } from './routes/user.role.route';
import { ProjectRoute } from './routes/project.route';
import { WorkflowRoute } from './routes/workflow.route';
import { StatusRoute } from './routes/status.route';
import { TaskRoute } from './routes/task.router';
import { TemplateRoute } from './routes/template.route';

ValidateEnv();

const app = new App([
  new UserRoute(),
  new AuthRoute(),
  new PrivilegeRoute(),
  new RoleRoute(),
  new RouteRoute(),
  new UserRoleRoute(),
  new ProjectRoute(),
  new WorkflowRoute(),
  new StatusRoute(),
  new TaskRoute(),
  new TemplateRoute(),
]);

app.listen();
