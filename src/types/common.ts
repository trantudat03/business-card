export interface TApp {
  isLoading: boolean;
  error: {
    code?: string;
    message: string;
    status?: number;
    data?: {
      message: string;
      name: string;
      status: number;
      api: string;
    };
  }[];
}

export interface Route {
  path: string;
  component: any;
  exact?: boolean;
  pageTitle?: string;
  key: string;
  checkLogin?: boolean;
  hasBottomNavigation?: boolean;
}

export interface RoutePath {
  path: string;
  replace?: boolean;
}
