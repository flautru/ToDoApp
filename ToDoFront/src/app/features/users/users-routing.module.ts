import { RouterModule, Routes } from '@angular/router';
import { UserFormComponent } from './pages/user-form/user-form.component';
import { NgModule } from '@angular/core';
import { UserListComponent } from './pages/user-list/user-list.component';

export const usersRoutes: Routes = [
  {
    path: 'add',
    component: UserFormComponent,
  },
  {
    path: 'list',
    component: UserListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(usersRoutes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
