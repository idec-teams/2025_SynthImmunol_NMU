
// 控制台日志开关
window.ENABLE_CONSOLE_LOG = false;
(function () {
    const originalLog = console.log;
    console.log = function (...args) {
        if (window.ENABLE_CONSOLE_LOG) {
            originalLog.apply(console, args);
        }
    };
})();
// 运行
$(document).ready(function () {

    /* 页面加载时统一插入 */
    // commonFunction();
    // 初始化回到顶部按钮
    initBackToTopButton();
    // 初始化鼠标跟随特效
    initMouseFollower();
    // 初始化下拉菜单
    initDropdownMenus();
    // 初始化滚动头部动画
    initScrollHeaderAnimation();
    // 初始化主菜单激活状态
    initMainMenuActiveState();
    // 初始化notebook页面功能
    initNotebookPage();

});

// async function commonFunction() {
//     console.log('commonFunction');
//     // 加载 header 和 footer
//     await loadPartial('header', '/partials/header.html');
//     await loadPartial('footer', '/partials/footer.html');
// }
// 加载部分
// async function loadPartial(id, file) {
//     const el = document.getElementById(id);
//     if (!el) return;
//     const html = await fetch(file).then(r => r.text());
//     el.innerHTML = html;
// }


(function () {
    'use strict';

    // 创建加载遮罩层
    function createLoadingOverlay() {
        // 创建遮罩层容器
        const overlay = document.createElement('div');
        overlay.id = 'global-loading-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.95);
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: opacity 0.3s ease-out;
        `;

        // 创建加载图片容器
        const loadingContainer = document.createElement('div');
        loadingContainer.style.cssText = `
            text-align: center;
            color: white;
        `;

        // 创建加载图片
        const loadingImg = document.createElement('img');
        loadingImg.src = '/2025_SynthImmunol_NMU/static/images/loading.gif';
        loadingImg.alt = 'Loading...';
        loadingImg.style.cssText = `
            max-width: 400px;
            max-height: 400px;
            width: auto;
            height: auto;
        `;

        // 创建加载百分比文字
        const loadingText = document.createElement('div');
        loadingText.id = 'loading-percentage';
        loadingText.textContent = '0%';
        loadingText.style.cssText = `
            margin-top: 15px;
            font-size: 24px;
            font-family: Arial, sans-serif;
            font-weight: bold;
        `;

        // 组装元素
        loadingContainer.appendChild(loadingImg);
        loadingContainer.appendChild(loadingText);
        overlay.appendChild(loadingContainer);

        return overlay;
    }

    // 百分比动画变量
    let percentageInterval = null;
    let currentPercentage = 0;

    // 更新百分比显示
    function updatePercentage() {
        const percentageElement = document.getElementById('loading-percentage');
        if (percentageElement) {
            percentageElement.textContent = currentPercentage + '%';
        }
    }

    // 开始百分比动画
    function startPercentageAnimation() {
        currentPercentage = 0;
        updatePercentage();

        percentageInterval = setInterval(() => {
            if (currentPercentage < 99) {
                // 随机增加1-5的百分比
                const increment = Math.floor(Math.random() * 5) + 1;
                currentPercentage = Math.min(currentPercentage + increment, 99);
                updatePercentage();
            }
        }, 100);
    }

    // 停止百分比动画
    function stopPercentageAnimation() {
        if (percentageInterval) {
            clearInterval(percentageInterval);
            percentageInterval = null;
        }

        // 快速完成到100%
        const finalInterval = setInterval(() => {
            if (currentPercentage < 100) {
                currentPercentage = Math.min(currentPercentage + 2, 100);
                updatePercentage();
            } else {
                clearInterval(finalInterval);
            }
        }, 50);
    }

    // 显示加载遮罩层
    function showLoadingOverlay() {
        // 检查是否已经存在遮罩层
        if (document.getElementById('global-loading-overlay')) {
            return;
        }

        const overlay = createLoadingOverlay();
        document.body.appendChild(overlay);

        // 开始百分比动画
        startPercentageAnimation();
    }

    // 隐藏加载遮罩层
    function hideLoadingOverlay() {
        const overlay = document.getElementById('global-loading-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 300); // 等待淡出动画完成
        }
    }

    // 页面加载完成后显示遮罩层
    function initLoadingOverlay() {
        // 立即显示遮罩层
        showLoadingOverlay();

        // 等待页面完全加载完成后隐藏遮罩层
        if (document.readyState === 'complete') {
            hideLoadingOverlay();
        } else {
            window.addEventListener('load', hideLoadingOverlay);
        }
    }

    // 初始化加载遮罩层
    initLoadingOverlay();

    // 暴露全局方法供外部调用
    window.showGlobalLoading = showLoadingOverlay;
    window.hideGlobalLoading = hideLoadingOverlay;

})();

// 回到顶部按钮功能
function initBackToTopButton() {
    // 等待DOM加载完成
    setTimeout(() => {
        const backToTopBtn = document.getElementById('back_top_img_btn');
        if (!backToTopBtn) {
            console.log('未找到回到顶部按钮元素');
            return;
        }

        console.log('找到回到顶部按钮元素:', backToTopBtn);

        // 滚动事件监听
        let scrollTimer = null;
        window.addEventListener('scroll', function () {
            // 防抖处理，避免频繁触发
            if (scrollTimer) {
                clearTimeout(scrollTimer);
            }

            scrollTimer = setTimeout(() => {
                // 获取滚动距离
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                // 当滚动超过300px时显示按钮
                if (scrollTop > 300) {
                    if (!backToTopBtn.classList.contains('show')) {
                        backToTopBtn.style.opacity = '0.4';
                        backToTopBtn.classList.add('show');
                        backToTopBtn.classList.remove('hidden');

                        console.log('显示回到顶部按钮，滚动距离:', scrollTop);
                    }
                } else {
                    if (backToTopBtn.classList.contains('show')) {
                        backToTopBtn.classList.remove('show');
                        backToTopBtn.classList.add('hidden');
                        // backToTopBt.style.opacity = '1';
                        console.log('隐藏回到顶部按钮，滚动距离:', scrollTop);
                    }
                }
            }, 10);
        });

        // 点击事件
        backToTopBtn.addEventListener('click', function (e) {
            e.preventDefault();

            // 平滑滚动到顶部
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // 添加鼠标进入和离开事件，实现透明度变化
        backToTopBtn.addEventListener('mouseenter', function () {
            this.style.opacity = '1';
        });

        backToTopBtn.addEventListener('mouseleave', function () {
            this.style.opacity = '0.4';
        });
    }, 100); // 延迟100ms确保footer已加载
}

// 鼠标跟随特效 - 圆环跟随效果
function initMouseFollower() {
    // 创建圆环跟随元素
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    document.body.appendChild(ripple);

    let hoverElement = null;

    function updateRipplePosition(x, y) {
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
    }

    // 鼠标移动事件
    document.addEventListener('mousemove', function (e) {
        requestAnimationFrame(() => updateRipplePosition(e.clientX, e.clientY));
    });

    // 点击动画效果
    document.addEventListener('mousedown', function () {
        ripple.classList.add('ripple-animation');
    });

    // 动画结束事件
    ripple.addEventListener('animationend', function () {
        ripple.classList.remove('ripple-animation');
    });

    // 悬停效果
    // document.querySelectorAll('img, a, button, [role="button"], .clickable, video').forEach(element => {
    //     element.addEventListener('mouseover', function() {
    //         ripple.classList.add('ripple-hover');
    //         hoverElement = element;
    //     });
    //     element.addEventListener('mouseout', function() {
    //         ripple.classList.remove('ripple-hover');
    //         hoverElement = null;
    //     });
    // });

    // 在移动设备上隐藏圆环
    if (window.innerWidth <= 768) {
        ripple.style.display = 'none';
    }

    // 窗口大小改变时重新检查
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            ripple.style.display = 'none';
        } else {
            ripple.style.display = 'block';
        }
    });
}

// 初始化下拉菜单功能
function initDropdownMenus() {
    // 等待header加载完成
    setTimeout(() => {
        console.log('开始初始化下拉菜单...');

        // 获取所有下拉菜单
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        console.log('找到下拉菜单数量:', dropdownToggles.length);

        dropdownToggles.forEach((toggle, index) => {
            const dropdown = toggle.closest('.dropdown');
            const dropdownMenu = dropdown.querySelector('.dropdown-menu');

            if (!dropdownMenu) {
                console.log('下拉菜单', index, '未找到dropdown-menu');
                return;
            }

            console.log('初始化下拉菜单', index, ':', toggle.textContent.trim());

            // 鼠标悬停显示（仅桌面端）
            if (window.innerWidth >= 992) {
                dropdown.addEventListener('mouseenter', function () {
                    console.log('鼠标进入下拉菜单:', toggle.textContent.trim());
                    // 关闭其他打开的下拉菜单
                    document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                        if (menu !== dropdownMenu) {
                            menu.classList.remove('show');
                        }
                    });
                    // 显示当前下拉菜单
                    dropdownMenu.classList.add('show');
                });

                dropdown.addEventListener('mouseleave', function () {
                    console.log('鼠标离开下拉菜单:', toggle.textContent.trim());
                    dropdownMenu.classList.remove('show');
                });
            }

            // 点击切换（移动端和桌面端都支持）
            toggle.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('点击下拉菜单:', toggle.textContent.trim());

                // 关闭其他打开的下拉菜单
                document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                    if (menu !== dropdownMenu) {
                        menu.classList.remove('show');
                    }
                });

                // 切换当前下拉菜单
                dropdownMenu.classList.toggle('show');
            });
        });

        // 点击外部关闭下拉菜单
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.dropdown')) {
                document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                    menu.classList.remove('show');
                });
            }
        });

        console.log('下拉菜单初始化完成');
    }, 300); // 延迟300ms确保header已加载
}

// 滚动飞入飞出动画效果
function initScrollFlyAnimation() {
    // 获取所有需要动画的元素
    const flyElements = document.querySelectorAll('.right-fly-content, .left-fly-content');
    const rotatingElements = document.querySelectorAll('.rotating-content');

    // 创建Intersection Observer来监听元素是否进入/离开视口
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 元素进入视口时添加相应的in类，移除out类
                if (entry.target.classList.contains('right-fly-content') || entry.target.classList.contains('left-fly-content')) {
                    entry.target.classList.remove('fly-out');
                    entry.target.classList.add('fly-in');
                } else if (entry.target.classList.contains('rotating-content')) {
                    entry.target.classList.remove('rotate-out');
                    entry.target.classList.add('rotate-in');
                }
            } else {
                // 元素离开视口时添加相应的out类，移除in类
                if (entry.target.classList.contains('right-fly-content') || entry.target.classList.contains('left-fly-content')) {
                    entry.target.classList.remove('fly-in');
                    entry.target.classList.add('fly-out');
                } else if (entry.target.classList.contains('rotating-content')) {
                    entry.target.classList.remove('rotate-in');
                    entry.target.classList.add('rotate-out');
                }
            }
        });
    }, {
        // 当元素50%可见时触发动画
        threshold: 0.5,
        // 添加一些边距，让动画提前触发
        rootMargin: '0px 0px -50px 0px'
    });

    // 开始观察所有飞入元素
    flyElements.forEach(element => {
        observer.observe(element);
    });

    // 开始观察所有旋转元素
    rotatingElements.forEach(element => {
        observer.observe(element);
    });

    console.log('滚动飞入飞出动画初始化完成，共监听', flyElements.length, '个飞入元素和', rotatingElements.length, '个旋转元素');
}

// 页面加载完成后初始化动画
document.addEventListener('DOMContentLoaded', function () {
    initScrollFlyAnimation();
});

// 如果页面已经加载完成，直接初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollFlyAnimation);
} else {
    initScrollFlyAnimation();
}

// 导航滚动功能
function initSidebarNavigation() {
    // 只选择侧边栏导航链接，排除主菜单的链接
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link, .sidebar-nav .nav-link-text');
    const sections = document.querySelectorAll('.rotating-content');

    // 平滑滚动到指定元素
    function smoothScrollTo(targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 100; // 添加一些偏移量
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    // 为每个导航链接添加点击事件
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // 如果是外部链接（不是以#开头的），允许正常跳转
            if (!href.startsWith('#')) {
                return; // 不阻止默认行为，允许正常跳转
            }

            e.preventDefault();
            const targetId = href.substring(1);

            // 移除所有激活状态
            navLinks.forEach(l => l.classList.remove('active'));
            // 添加当前激活状态
            this.classList.add('active');

            // 滚动到目标元素
            smoothScrollTo(targetId);
        });
    });

    // 监听滚动事件，更新激活状态
    function updateActiveNav() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    // 节流函数，优化滚动性能
    function throttle(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 监听滚动事件
    window.addEventListener('scroll', throttle(updateActiveNav, 100));

    console.log('侧边栏导航初始化完成，共', navLinks.length, '个导航链接');
}

// 页面加载完成后初始化导航
document.addEventListener('DOMContentLoaded', function () {
    initSidebarNavigation();
});

// 如果页面已经加载完成，直接初始化导航
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSidebarNavigation);
} else {
    initSidebarNavigation();
}

// 初始化滚动头部动画
function initScrollHeaderAnimation() {
    let lastScrollTop = 0;
    let isScrolling = false;
    let headerHidden = false;
    let scrollDistance = 0; // 记录滚动距离
    const header = document.querySelector('.header--fixed');

    if (!header) return;

    // 添加初始可见状态
    header.classList.add('header-visible');

    function handleScroll() {
        if (isScrolling) return;

        isScrolling = true;
        requestAnimationFrame(() => {
            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // 如果滚动距离小于 50px，始终显示头部
            if (currentScrollTop < 50) {
                header.classList.remove('header-hidden');
                header.classList.add('header-visible');
                headerHidden = false;
                scrollDistance = 0;
            } else {
                // 向下滚动时隐藏头部
                if (currentScrollTop > lastScrollTop && currentScrollTop > 50) {
                    if (!headerHidden) {
                        header.classList.remove('header-visible');
                        header.classList.add('header-hidden');
                        headerHidden = true;
                        scrollDistance = 0; // 重置滚动距离
                    }
                }
                // 向上滚动时显示头部 - 需要向上滚动超过100px才显示
                else if (currentScrollTop < lastScrollTop && headerHidden) {
                    scrollDistance += (lastScrollTop - currentScrollTop);

                    if (scrollDistance > 100) {
                        header.classList.remove('header-hidden');
                        header.classList.add('header-visible');
                        headerHidden = false;
                        scrollDistance = 0; // 重置滚动距离
                    }
                }
            }

            lastScrollTop = currentScrollTop;
            isScrolling = false;
        });
    }

    // 添加滚动事件监听器
    window.addEventListener('scroll', handleScroll, { passive: true });
}

// 初始化主菜单激活状态
function initMainMenuActiveState() {
    // 获取当前页面路径
    const currentPath = window.location.pathname;

    // 清除所有主菜单的 active 状态
    const mainNavLinks = document.querySelectorAll('.navbar-nav .nav-link, .navbar-nav .dropdown-item');
    mainNavLinks.forEach(link => {
        link.classList.remove('active');
    });

    // 根据当前路径设置对应的菜单项为 active
    mainNavLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href !== '#' && !href.startsWith('#')) {
            // 处理相对路径和绝对路径
            const linkPath = href.startsWith('/') ? href : '/' + href;
            if (currentPath === linkPath || currentPath.endsWith(linkPath)) {
                link.classList.add('active');

                // 如果是下拉菜单项，也要激活其父级菜单
                const parentDropdown = link.closest('.dropdown');
                if (parentDropdown) {
                    const parentToggle = parentDropdown.querySelector('.dropdown-toggle');
                    if (parentToggle) {
                        parentToggle.classList.add('active');
                    }
                }
            }
        }
    });

    console.log('主菜单激活状态初始化完成，当前路径:', currentPath);
}

// 初始化notebook页面功能
function initNotebookPage() {
    // 检查是否在notebook页面
    if (!window.location.pathname.includes('notebook.html')) {
        return;
    }

    console.log('初始化notebook页面功能...');

    // 获取所有的note li元素
    const noteItems = document.querySelectorAll('.months-list .month-item');
    const ulElement = document.querySelector('.month-parts.g-label-0');
    const partItems = document.querySelectorAll('.month-parts .part-item');
    const noteContents = document.querySelectorAll('.note-content-wrap .note-content');

    const noteContentWrap = document.querySelector('.note-content-wrap');

    if (!noteItems.length || !ulElement || !partItems.length) {
        console.log('未找到notebook相关元素');
        return;
    }

    console.log('找到', noteItems.length, '个note项目');
    console.log('找到', partItems.length, '个子菜单项');
    console.log('找到', noteContents.length, '个实验内容');

    // 为每个note项目添加点击事件
    noteItems.forEach((item, index) => {
        item.addEventListener('click', function () {
            console.log('点击了note', index + 1);

            // 移除所有li的active类
            noteItems.forEach(li => li.classList.remove('active'));

            // 给当前点击的li添加active类
            this.classList.add('active');

            // 更新ul的类名，从g-label-1改为g-label-{序号}
            const newClass = `g-label-${index + 1}`;
            ulElement.className = `month-parts ${newClass}`;

            console.log('更新ul类名为:', newClass);
        });
    });

    // 为每个子菜单项添加点击事件
    partItems.forEach((partItem, index) => {
        partItem.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('点击了子菜单项', index + 1);

            // 移除所有子菜单项的active类
            partItems.forEach(item => item.classList.remove('active'));

            // 给当前点击的子菜单项添加active类
            this.classList.add('active');

            // 隐藏所有实验内容
            noteContents.forEach(content => {
                content.style.display = 'none';
            });

            // 显示对应的实验内容（如果有的话）
            if (noteContents[index]) {
                noteContents[index].style.display = 'block';
                console.log('显示实验内容', index + 1);
                noteContentWrap.classList.remove('empty-init');
                noteContentWrap.querySelector('.empty-init-content').style.display = 'none';
            } else {
                console.log('没有找到对应的实验内容', index + 1);
            }
        });
    });

    // 初始化时隐藏所有实验内容，只显示提示信息
    noteContents.forEach(content => {
        content.style.display = 'none';
    });

    // 给.note-content-wrap添加empty-init类，并插入提示div
    // const noteContentWrap = document.querySelector('.note-content-wrap');
    if (noteContentWrap) {
        noteContentWrap.classList.add('empty-init');
        // 检查是否已存在提示内容，避免重复插入
        if (!noteContentWrap.querySelector('.empty-init-content')) {
            const tipDiv = document.createElement('div');
            tipDiv.className = 'note-content empty-init-content';
            tipDiv.textContent = 'CLICK ON THE RED TAB TO VIEW THE INDIVIDUAL LAB RECORDS';
            noteContentWrap.appendChild(tipDiv);
        }
    }

    console.log('notebook页面功能初始化完成');
}

