/* From the useImperativeHandle, useRef hook, I can see this is React 16+ */
import React, {
  useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ErrorViewTemplateSmall from 'services/bugsnag/ErrorViewTemplateSmall';
import Widget from 'widgets/Widget';
import useButtonLayoutMap from 'ui/app/inputs/buttons/partials/use-button-layout-map';
import { useGSAP } from '@gsap/react';
import useColorValue from 'support/hooks/ui/styling/use-color-value';
import gsap from 'gsap';
import twClassNames from 'support/utilities/tailwind/twClassNames';

/**
 * A wrapper component for adding a button
 */

const Button = React.forwardRef((props, ref) => {

  /* 
  Component attributes 
  Here is the destructuring of props with default values
  */
  const {
    layout = 'primary',
    width = 'default',
    size = 'default',
    hoverEnabled = true,
    className,
    containerClassName,
    children,
    active = false,
    highlight = false, /// Not currently supported here
    withoutButtonTag = false,
    textColor,
    noTransition = false,
    fontWeight = 'medium',
    center = true,
    defaultPadding = true,
    defaultOutline = true,
    loadingAnimation = false,
    isLoading = false,
    loadingPercent = 0,
    fromLoadingPercent = 0,
    hasErrors = false,
    textNoWrap = true,
    loadingAnimatingCallback,
    ...forwardProps
  } = props;

  /* 
  Call the useColorValue hook with the default colors, here the color is hard code. 
  The hook useColorValue can not be fround from the resource.
  */
  const purple = useColorValue('purple');
  const red = useColorValue('red');

  /* 
  Basic styling for the button using tailwind classes
  */
  const baseStyling = [
    'inline-flex',
    { 'items-center justify-center': center },
    'text-center',
    [`font-${fontWeight}`],
    'rounded',
    { 'outline-none focus-visible:outline-purple': defaultOutline },
    { 'transition ease-in-out duration-150': !noTransition },
    { 'whitespace-no-wrap': textNoWrap },
    'cursor-pointer',
    'disabled:cursor-default',
    'z-0 relative',
  ];

  /*
  Size mapping for different button sizes
  */
  const sizeMap = {
    large: ['h-12 py-1', { 'px-4': defaultPadding && layout !== 'text' }],
    default: ['h-10', { 'px-3.5': defaultPadding && layout !== 'text' }, { 'h-auto': !textNoWrap }],
    small: ['h-10', { 'px-3': defaultPadding && layout !== 'text' }],
    xsmall: ['h-8', { 'px-2.5': defaultPadding && layout !== 'text' }],
    xxsmall: ['h-6', { 'px-2': defaultPadding && layout !== 'text' }],
    custom: '',
  };

  /*
  Text size mapping for different button sizes
  */
  const textSizeMap = {
    large: '',
    default: 'text-sm',
    small: 'text-smedium',
    xsmall: 'text-xs',
    xxsmall: 'text-xs',
    custom: '',
  };

  /*
  Width mapping for different button widths
  */
  const widthMap = {
    default: '',
    full: 'w-full',
    square: size === 'small' ? 'w-10' : size === 'large' ? 'w-12' : 'w-11',
  };

  /*
  Layout mapping for different button layouts
  This hook is exported from 'partials/use-button-layout-map'
  */
  const layoutMap = useButtonLayoutMap(textColor, hoverEnabled);

  /*
  Combine all the class names for the button
  */
  const buttonClasses = twClassNames(
    baseStyling,
    sizeMap[size],
    isLoading ? 'cursor-wait border border-purple' : layoutMap[layout][active],
    widthMap[width],
    { [`text-${textColor}`]: textColor },
    className,
    'tracking-wide',
  );

  /*
  Determine the text size class based on the size prop
  Why this is existing here? That is not included in the sizeMap above?
  Maybe some other reason, but I think the styling should be together.
  */
  const buttonTextSize = textSizeMap[size];

  /* 
  The magnet ref that maybe using for moving the button?
  */
  const magnetRef = useRef();

  /* 
  Function to handle the magnet effect on mouse move
  Should here using the hooks that can put let the React Control the DOM?
  */
  const moveMagnet = (event) => {
    if (!(layout === 'primary' && !withoutButtonTag)) return;
    if (!magnetRef.current) return;
    /*
    Is here using the actual DOM API to get the bounding client rect?
    That is not recommended in React, should using the hooks to get the size and position of the element.
    */
    const magnetButton = event.currentTarget;
    const bounding = magnetButton.getBoundingClientRect();
    /*
    Why the strength is 10? That is a magic number?
    Maybe should be a prop that can be configured by the user.
    At least make a constant outside of the function.
    */
    const strength = 10;

    gsap.to(magnetRef.current, {
      x: (((event.clientX - bounding.left) / magnetButton.offsetWidth) - 0.5) * strength,
      y: (((event.clientY - bounding.top) / magnetButton.offsetHeight) - 0.5) * strength,
    });
  };

  /* 
  Function to reset the magnet effect on mouse out
  Same as above, should using the React way to handle the DOM?
  */
  const moveOut = (event) => {
    if (!(layout === 'primary' && !withoutButtonTag)) return;
    if (!magnetRef.current) return;
    if (magnetRef.current !== event.currentTarget && magnetRef.current?.contains(event.currentTarget)) return;
    gsap.to(magnetRef.current, {
      x: 0,
      y: 0,
      ease: 'power4.out',
      duration: 1,
    });
  };

  /*
  What is the gsap context safe here?
  */
  const { contextSafe } = useGSAP();

  /*
  Finally using the state to handle the shine effect on the button
  */
  const [spanTransformShine, setSpanTransformShine] = useState({
    translate: '-100% 0%',
  });

  /*
  Nothing to say, here just export the button ref using useImperativeHandle hook
  */
  const buttonRef = useRef();

  /*
  这里直接就把整个组件暴露出去了, 为什么?
  */
  useImperativeHandle(ref, () => buttonRef.current);

  /*
  这个部分看起来像是控制鼠标进入和离开按钮时的动画效果的, 但是为什么不使用 Tailwind 的 hover 功能呢?
  它还使用了 useCallback 来优化性能, 但是依赖项中包含了 withoutButtonTag, 但是在函数体内并没有使用它, 这是为什么?
  可能是为了防止函数在 withoutButtonTag 改变时重新创建, 但是这样做没有意义.
  另外, 这个函数中有一些注释提到了 mouseout 事件的语义, 但是实际上并没有使用相关的逻辑来处理这些事件.
  同时, 这个函数并没有监听 mouseenter 和 mouseout 事件, 而是通过传入的事件对象来判断事件类型, 这可能会导致一些问题.
  */
  const enterAndOut = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!buttonRef.current) return;

    // Handle mouseenter event
    if (e.type === 'mouseenter') {
      if (layout === 'primary') {
        setSpanTransformShine({
          translate: '100% 0%',
        });
      }
    }

    // mouseout semantics: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget
    // the element that triggered the event, entered to, exited from
    // console.log(e.currentTarget, e.relatedTarget, e.target);

    // Handle mouseleave event
    if (e.type === 'mouseout') {
      // Check if the mouse is leaving the button and not entering a child element
      if (buttonRef.current && !buttonRef.current?.contains(e.relatedTarget)) {
        if (layout === 'primary') {
          setSpanTransformShine({
            translate: '-100% 0%',
          });
        }
      }
    }
  }, [layout, withoutButtonTag]);

  /*
  有一个问题待查, useRef 没有初始化 ref 的对象, 会找到正确的 ref 吗?
  看起来是可以的, 因为 useRef 会在组件挂载后赋值给 ref.current.
  但是如果在组件挂载前访问 ref.current 会得到 undefined.
  这里的 fillUpAnimRef 应该是在按钮加载动画时使用的.
  */ 
  const fillUpAnimRef = useRef();

  /*
  这个部分是处理按钮加载动画的逻辑.
  使用了 useMemo 来缓存动画元素, 避免每次渲染都重新创建.
  根据 layout 和 loadingAnimation 的值来决定是否渲染动画元素.
  但是这个是不是可以放到组件的外面去? 是不是新组件?
  这样可以让代码更清晰, 也更容易维护.
  */
  const animationElements = useMemo(() => (
    <>
      {
        layout === 'primary'
        && (
          <span
            className="absolute overflow-hidden bg-purple pointer-events-none"
            style={{
              zIndex: -1, top: -1, left: -1, width: 'calc(100% + 2px)', height: 'calc(100% + 2px)', borderRadius: 3,
            }}
          >
            <span
              className="absolute block pointer-events-none"
              style={{
                ...spanTransformShine,
                zIndex: 2,
                transition: 'all 650ms',
                width: '200%',
                height: '100%',
                backgroundSize: '25%',
                background: 'linear-gradient(120deg, rgba(86, 58, 201, 1), rgba(187, 176, 233, 1), rgba(86, 58, 201, 1))',
              }}
            />
          </span>
        )
      }
      {
        loadingAnimation
        && (
        <span
          ref={fillUpAnimRef}
          className="absolute top-0 left-0 w-0 overflow-hidden pointer-events-none"
          style={{
            zIndex: 1, width: `${fromLoadingPercent}%`, marginTop: -1, height: 'calc(100% + 1px)', left: -1, color: 'white',
          }}
        >
          <span className={twClassNames(buttonClasses, 'bg-purple text-white', buttonTextSize)}>
            {children}
          </span>
        </span>
        )
      }
    </>
  ), [layout, spanTransformShine, loadingAnimation, purple]);

  /*
  This part is handling the loading animation logic for the button.
  It uses useEffect to restart the animation timeline whenever the loadingPercent changes.
  If loadingAnimation is true and loadingPercent is a number, it creates a GSAP timeline to animate the fill-up effect.
  If there are no errors, it animates the width of the fill-up element from fromLoadingPercent to loadingPercent,
  and also adds a scaling effect to the button when loadingPercent reaches 100%.
  If there are errors, it animates the fill-up element to shrink back to 0% width and changes its color to red.
  */
  const timelineRef = useRef(gsap.timeline({ paused: true }));

  useEffect(() => {
    timelineRef.current.restart();
  }, [loadingPercent]);

  useGSAP(() => {
    /*
    这漂亮的嵌套条件语句, 真是让人爱不释手.
    */
    if (buttonRef.current && fillUpAnimRef.current) {
      if (loadingAnimation && typeof loadingPercent === 'number') {
        const timeline = timelineRef.current;
        timeline.clear();
        if (!hasErrors) {
          timeline.to(fillUpAnimRef.current, {
            width: `${fromLoadingPercent}%`,
            duration: 0,
          }).to(fillUpAnimRef.current, {
            width: `${loadingPercent}%`,
            duration: 1,
            ease: 'circ.out',
            onStart: () => {
              loadingAnimatingCallback?.(true);
            },
          }).to(buttonRef.current, {
            scale: loadingPercent === 100 ? 1.1 : 1,
            duration: 0.5,
            delay: -0.5,
            ease: 'power4.inOut',
            repeat: 1,
            yoyo: true,
            yoyoEase: 'power4.inOut',
          }).to(buttonRef.current, {
            duration: 0.5,
            onComplete: () => {
              loadingAnimatingCallback?.(false);
            },
          });
        } else {
          timeline.to(fillUpAnimRef.current, {
            backgroundColor: red,
            width: '0%',
            duration: 1,
            ease: 'circ.out',
            onComplete: () => {
              loadingAnimatingCallback?.(false);
            },
          });
        }
      }
    }
  }, [loadingAnimation, loadingPercent, hasErrors]);

  /*
  后面这两个 button 是不是可以抽离成两个组件?
  这样可以让代码更清晰, 也更容易维护.
  */
  const button = (
    <button ref={buttonRef} className={classNames(buttonClasses, isLoading ? 'bg-white text-purple hover:bg-white hover:text-purple active:bg-white active:text-purple' : '', buttonTextSize)} {...forwardProps} onMouseEnter={enterAndOut} onMouseOut={enterAndOut}>
      {animationElements}
      {children}
    </button>
  );

  const buttonWithMagnet = (
    <span className={twClassNames(containerClassName, '-m-4 p-4 rounded-full inline-flex box-content')} ref={magnetRef} onMouseMove={contextSafe(moveMagnet)} onMouseLeave={contextSafe(moveOut)}>
      {button}
    </span>
  );

  /*
  这部分条件, 我估计可以放到前面去, 后面的部分就不用渲染了
  另外, 这里的 Widget 组件是做什么用的? 看起来像是一个错误边界组件.
  但是为什么要包裹整个按钮组件呢? 这会不会影响性能?
  另外, 这里的 layout === 'primary' ? buttonWithMagnet : button 逻辑, 是不是可以放到上面去?
  这样可以让代码更清晰, 也更容易维护.
  这个 Widget 组件是从哪里来的? 这个代码片段没有提供它的定义.

  这里还重复使用了 Widget 组件, 其实可以放一起.
  */
  if (!withoutButtonTag) {
    return (
      <Widget FallbackComponent={ErrorViewTemplateSmall}>
        {
          layout === 'primary' ? buttonWithMagnet : button
        }
      </Widget>
    );
  }

  return (
    <Widget FallbackComponent={ErrorViewTemplateSmall}>
      <span ref={buttonRef} className={classNames(buttonClasses, 'inline-flex', buttonTextSize)} {...forwardProps} onMouseEnter={enterAndOut} onMouseOut={enterAndOut}>
        { animationElements }
        {children}
      </span>
    </Widget>
  );
});

/*
按钮的类型只定义了三个, 其它的呢?
*/
Button.propTypes = {
  /**
   * layout of buttons, the layout of the button UI (Default = Primary) <br>
   * Types: primary | secondary | borderless
   */
  layout: PropTypes.oneOf(['underline', 'primary', 'primary-no-anim', 'secondary', 'secondary-muted', 'secondary-serene', 'stateful', 'danger', 'danger-secondary', 'danger-outline', 'borderless', 'text', 'gray', 'gray-muted', 'navigation', 'clean', 'muted', 'circleso', 'fiverr', 'toast', 'none', 'green']),
  /**
     * Width of the button<br>
     * Sizes: See tailwind width classes .w-{your class}
     */
  width: PropTypes.string,
  /**
   * Active, represents whether the button is currently active, if the button is active the styling will be changed.
   */
  active: PropTypes.bool,
};

export default Button;
