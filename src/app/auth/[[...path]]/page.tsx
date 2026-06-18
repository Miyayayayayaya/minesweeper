'use client';

import { useEffect, useState } from 'react';
import SuperTokens from 'supertokens-auth-react';
import EmailPassword from 'supertokens-auth-react/recipe/emailpassword';
import { EmailPasswordPreBuiltUI } from 'supertokens-auth-react/recipe/emailpassword/prebuiltui';
import Session from 'supertokens-auth-react/recipe/session';
import { canHandleRoute, getRoutingComponent } from 'supertokens-auth-react/ui';

if (typeof window !== 'undefined') {
  SuperTokens.init({
    appInfo: {
      appName: 'supertokens-app2',
      apiDomain: 'http://localhost:4000',
      websiteDomain: 'http://localhost:3000',
      apiBasePath: '/auth',
      websiteBasePath: '/auth',
    },
    recipeList: [EmailPassword.init(), Session.init()],
  });
}

export default function AuthPage() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, []);
  if (!loaded) return null;
  if (canHandleRoute([EmailPasswordPreBuiltUI])) {
    return getRoutingComponent([EmailPasswordPreBuiltUI]);
  }

  return <div>Not Found</div>;
}
