import { RouterModule, Routes } from '@angular/router';
import { UserFormComponent } from './pages/user-form/user-form.component';
import { NgModule } from '@angular/core';

export const usersRoutes: Routes = [
  {
    path: 'add',
    component: UserFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(usersRoutes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
