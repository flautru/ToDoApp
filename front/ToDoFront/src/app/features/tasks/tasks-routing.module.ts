import { TaskFormComponent } from './pages/task-form/task-form.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskCardComponent } from './pages/task-card/task-card.component';
import { TaskListComponent } from './pages/task-list/task-list.component';

const routes: Routes = [
  { path: 'card', component: TaskCardComponent },
  { path: '', component: TaskListComponent },
  { path: 'new', component: TaskFormComponent},
  { path: ':id/edit', component: TaskFormComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule { }
