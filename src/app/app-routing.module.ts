import { NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRouteSnapshot, RouterStateSnapshot, Route, UrlSegment } from '@angular/router';

const routes: Routes = [
  {
    path: 'app-client',
    loadChildren: () => import('../../projects/app-client/src/app/app.module').then(mod => mod.AppModule),
    canLoad: ['canLoadGuard'],
    canActivate: ['canActivateGuard']
  },
  {
    path: 'app-task',
    loadChildren: () => import('../../projects/app-task/src/app/app.module').then(mod => mod.AppModule),
    canLoad: ['canLoadGuard'],
    canActivate: ['canActivateGuard']
  },
  {
    path: '**',
    redirectTo: '/app-client/list'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
  providers: [
    {
      provide: 'canActivateGuard',
      useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        console.log('canActivateGuard');
        return true;
      }
    },
    {
      provide: 'canLoadGuard',
      useValue: (route: Route, segments: UrlSegment[]) => {
        console.log('canLoadGuard');
        return true;
      }
    }
  ]
})
export class AppRoutingModule { }
