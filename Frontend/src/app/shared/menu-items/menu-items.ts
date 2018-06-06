import { Injectable } from '@angular/core';

export interface BadgeItem {
  type: string;
  value: string;
}

export interface ChildrenItems {
  state: string;
  name: string;
  type?: string;
}

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  badge?: BadgeItem[];
  children?: ChildrenItems[];
}

// Home page side-menu here
const MENUITEMS = [
  {
    state: '/',
    name: 'HOME',
    type: 'link',
    icon: 'basic-accelerator'
  },
  {
    state: 'authentication',
    name: 'Start',
    type: 'sub',
    icon: 'basic-lock-open',
    children: [
      {
        state: 'signin',
        name: 'Sign In'
      },
      {
        state: 'signup',
        name: 'SIGNUP'
      },{
        state: 'adminpanel',
        name: 'AdminPanel'
      }
    ]

  },
  {
    state: 'docs',
    name: 'DOCS',
    type: 'link',
    icon: 'basic-sheet-txt'
  }
  
];

// Admin side-menu here
const ADMINMENU = [
  
    {
      state: 'profile',
      name: 'Profile',
      type: 'link',
      icon: 'basic-accelerator'
    },
    {
      state: 'addadmin',
      name: 'AddAdmin',
      type: 'link',
      icon: 'basic-lock-open'

    },
    {
      state: 'usersprofiles',
      name: 'View Profiles',
      type: 'link',
      icon: 'basic-elaboration-document-picture'

    },
    {
      state: 'filtersessionrequests',
      name: 'Filter Session Requests',
      type: 'link',
      icon: 'basic-elaboration-document-picture'
    },
    {
      state: 'expertRequests',
      name: 'Expert Requests',
      type: 'link',
      icon: 'basic-elaboration-document-picture'
    }
];

// User side-menu here

  

  const USERMENU = [
    
    {
      state: 'home',
      name: 'Home',
      type: 'link',
      icon: 'basic-home'
    }
    ,{
      state: 'viewUserProfile',
      name: 'Profile',
      type: 'link',
      icon: 'basic-accelerator'
    },

    {
      state: 'Questions',
      name: 'My Questions',
      type: 'link',
      icon: 'basic-question'
    },
    {
      state:'cancelReservation',
      name: 'Upcoming Sessions',
      type: 'link',
      icon:'basic-accelerator'
  
    
    },
    {
      state: 'viewQuestionsOnTag',
      name: 'Previously Asked Questions',
      type: 'link',
      icon: 'basic-question'
  
    }
    
  ];
  


 // {
   // state: 'home',
    //name: 'Home',
    //type: 'link',
    //icon: 'basic-accelerator'
  //}
//];


// Expert side-menu here
const EXPERTMENU = [
  
  {
    state: 'experthome',
    name: 'Home',
    type: 'link',
    icon: 'basic-accelerator'
  },
  {


    state: 'expertquestions',
    name: 'Questions',
    type: 'link',
    icon: 'basic-question'
  },
  
  {
    state: 'expertSessionRequests',
    name: 'Session Requests',
    type: 'link',
    icon: 'basic-question'
  },
  {
    state:'expertProfile',
    name: 'Your Profile',
    type: 'link',
    icon:'basic-notebook-pencil'
  },
  {
    state:'cancelReservation',
    name: 'Upcoming Sessions',
    type: 'link',
    icon:'basic-accelerator'
  }
];

@Injectable()
export class MenuItems {
  getAll(): Menu[] {
    return MENUITEMS;
  }

  getAdminMenu(): Menu[] {
    return ADMINMENU;
  }

  getUserMenu(): Menu[] {
    return USERMENU;
  }

  getExpertMenu(): Menu[] {
    return EXPERTMENU;
  }

  add(menu: Menu) {
    MENUITEMS.push(menu);
  }
}