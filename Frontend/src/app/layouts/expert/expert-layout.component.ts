import { Component, OnInit, OnDestroy, ViewChild, HostListener, AnimationTransitionEvent, NgZone, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { MenuItems } from '../../shared/menu-items/menu-items';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'angular2-cookie/services/cookies.service';

const SMALL_WIDTH_BREAKPOINT = 991;

export interface Options {
  heading?: string;
  removeFooter?: boolean;
  mapHeader?: boolean;
}

@Component({
  selector: 'expert-layout',
  templateUrl: './expert-layout.component.html',
  styleUrls: ['./expert-layout.component.scss']
})
export class ExpertLayoutComponent implements OnInit, OnDestroy, AfterViewInit {

  private _router: Subscription;
  private mediaMatcher: MediaQueryList = matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`);

  currentLang = 'en';
  options: Options;
  theme = 'dark';
  showSettings = false;
  isDocked = false;
  isBoxed = false;
  isOpened = true;
  mode = 'push';
  _mode = this.mode;
  _autoCollapseWidth = 991;
  width = window.innerWidth;
  numberOfNotifications;
  notifications=[];
  done=false;

  @ViewChild('sidebar') sidebar;

  constructor (
    public menuItems: MenuItems,
    private router: Router,
    private route: ActivatedRoute,
    public translate: TranslateService,
    private modalService: NgbModal,
    private titleService: Title,
    private zone: NgZone,
    public cookie: CookieService) {
    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
    this.mediaMatcher.addListener(mql => zone.run(() => this.mediaMatcher = mql));
  }

  async ngOnInit() {
    
    if (this.isOver()) {
      this._mode = 'over';
      this.isOpened = false;
    }

    this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
      // Scroll to top on view load
      document.querySelector('.main-content').scrollTop = 0;
      this.runOnRouteChange();
    });
    // await this.NotificationService.viewNotifications().subscribe(
    //   Response => {
    //     //console.log(Response.data);
    //     if(Response!=null){
    //     this.numberOfNotifications= Response.data[0].length+Response.data[1].length;
    //     this.numberOfNotifications= Response.data[0].length+Response.data[1].length;
    //     var allNots = Response.data[0].concat(Response.data[1]);
    //     var n = (allNots.length>3)? 3:allNots.length;
        
    //     //console.log(allNots);
    //     for(var i = 0; i<n ; i++){
    //     this.notifications[i] = allNots[i];
    //   }
    // }
    //   },
    //   err =>{
    //     console.log(err);
    //   }
    // );

  }

  ngAfterViewInit(): void  {
    setTimeout(_ => this.runOnRouteChange());
  }

  ngOnDestroy() {
    this._router.unsubscribe();
  }

  runOnRouteChange(): void {
    if (this.isOver() || this.router.url === '/maps/fullscreen') {
      this.isOpened = false;
    }

    this.route.children.forEach((route: ActivatedRoute) => {
      let activeRoute: ActivatedRoute = route;
      while (activeRoute.firstChild) {
        activeRoute = activeRoute.firstChild;
      }
      this.options = activeRoute.snapshot.data;
    });

    if (this.options) {
      if (this.options.hasOwnProperty('heading')) {
        this.setTitle(this.options.heading);
      }
    }
  }

  setTitle( newTitle: string) {
    this.titleService.setTitle( 'RiseUP Expert |' + newTitle );
  }

  toogleSidebar(): void {
    this.isOpened = !this.isOpened;
  }

  isOver(): boolean {
    return window.matchMedia(`(max-width: 991px)`).matches;
  }

  openSearch(search) {
    this.router.navigate(['/expert/searchexpert']);
    //this.modalService.open(search, { windowClass: 'search', backdrop: false });  
  }

  addMenuItem(): void {
    this.menuItems.add({
      state: 'menu',
      name: 'MENU',
      type: 'sub',
      icon: 'basic-webpage-txt',
      children: [
        {state: 'menu', name: 'MENU'},
        {state: 'menu', name: 'MENU'}
      ]
    });
  }

  logout(){
    this.cookie.remove('token');
    setTimeout(() => {
      this.router.navigate ( [ '/authentication/signin' ] );
    }, 0);
  }

}
