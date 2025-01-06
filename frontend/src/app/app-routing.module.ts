import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessFormComponent } from './components/business-form/business-form.component';
import { AnalysisResultsComponent } from './components/analysis-results/analysis-results.component';

const routes: Routes = [
  { path: '', component: BusinessFormComponent },
  { path: 'analysis', component: AnalysisResultsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 