import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { CalculatorComponent } from './calculator/calculator.component';

const routes: Routes = [
	{path: '', redirectTo: '/calc', pathMatch: 'full'},
	{path: 'about', component: AboutComponent},
	{path: 'calc', component: CalculatorComponent},
	{path: '**', redirectTo: '/calc', pathMatch: 'full'} // 404 redirects
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})

export class AppRoutingModule {}
