import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { useInView } from 'react-intersection-observer';
import { motion, useAnimation, AnimateSharedLayout, AnimatePresence } from 'framer-motion';
import { graphql, useStaticQuery } from 'gatsby';
import { global, styled } from 'gatsby-theme-stitches/src/stitches.config';
import { rem } from 'polished';

import _Header from './layout/Header';
import _Footer from './layout/Footer';

const globalStyles = global({
  '*': {
    margin: 0,
    fontFamily: 'inherit',
  },
  'body': {
    color: '$gray900',
    fontFamily: 'sans-serif',
    textRendering: 'optimizeLegibility',
    wordBreak: 'break-word',
    WebkitFontSmoothing: 'antialiased'
  },
  'body:lang(ko)': {
    wordBreak: 'keep-all',
  },
  'a': {
    color: '$carrot500',
  },
  '@media (prefers-reduced-motion: no-preference)': {
    ':focus': {
      transition: 'outline-offset .25s ease',
      outlineOffset: '3px',
    },
  },
});

const Header = styled(_Header, {
  marginBottom: rem(36),

  variants: {
    wide: {
      true: {
        marginBottom: rem(100),
      },
    },
  },
});

const Footer = styled(_Footer, {
  marginTop: rem(120),

  variants: {
    wide: {
      true: {
        marginTop: rem(160),
      },
    },
  },
});

const Main = styled(motion.main, {
  paddingX: rem(24),

  variants: {
    wide: {
      true: {
        maxWidth: '$maxContent',
        margin: '0 auto',
      },
    },
  },
});

const variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const transition = {
  type: 'spring',
  mass: 0.35,
  stiffness: 50,
  duration: 3.0,
};

const Layout: React.FC = ({
  children,
}) => {
  globalStyles();

  const controls = useAnimation();

  const [isMounted, mount] = React.useReducer(() => true, false);
  React.useEffect(() => {
    mount();
  }, []);

  React.useEffect(() => {
    if (!isMounted) {
      controls.set('hidden');
    }
    if (isMounted) {
      controls.start('visible');
    }
  }, [isMounted, controls]);

  const data = useStaticQuery<GatsbyTypes.LayoutStaticQuery>(graphql`
    query LayoutStatic {
      siteNavigation {
        ...Header_navigation
        ...Footer_navigation
      }
    }
  `);

  if (!data.siteNavigation) {
    throw new Error('SiteNavigation 노드가 없습니다.');
  }

  return (
    <>
      <Helmet key="helmet">
        <html lang="ko" />
      </Helmet>
      <Header
        key="header"
        navigation={data.siteNavigation}
        wide={{ '@sm': true }}
      />
      <Main
        key="main"
        initial="visible"
        animate={controls}
        variants={variants}
        transition={transition}
        wide={{ '@sm': true }}
      >
        {children}
      </Main>
      <Footer
        key="footer"
        navigation={data.siteNavigation}
        wide={{ '@sm': true }}
      />
    </>
  );
}

export default Layout;
