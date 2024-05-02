
const plausibleAttributes = {
    "data-domain": "arezzo.deco.site",
    "data-api": "https://plausible.io/api/event",
    "src": "https://plausible.io/js/script.manual.hash.js",
    "defer": "true"
}

function addPlausible(){
    let newScript = document.createElement('script');
    for (const [key, value] of Object.entries(plausibleAttributes)) {
        newScript.setAttribute(key, value);
    }
    document.head.appendChild(newScript);
}

function runJS(jsToRun){
    eval(jsToRun)
}

function addCSS(cssToAdd) {
    var style = document.createElement('style');
    style.type = 'text/css';

    if (style.styleSheet) {
        // This is required for IE8 and below.
        style.styleSheet.cssText = cssToAdd;
    } else {
        style.appendChild(document.createTextNode(cssToAdd));
    }
    document.head.appendChild(style);
}

function trackElements(elementsToTrack, flags){
    elementsToTrack.forEach(element => {
        const elements = document.querySelectorAll(element.cssSelector)
        elements.forEach(el => {
            el.addEventListener(element.eventType, () => {
                globalThis.window.DECO.sendEvent?.(element.eventName)
            })
        })
    })
}

async function fetchScript(){
    const response = await fetch("http://localhost:8000/live/invoke/abTest", {
        credentials: 'include'
    });

    const result = await response.json();
    let flags = result.flags

    if(Object.entries(flags).length === 0){
        // fetch again to get flags
        // this is a workaround to get flags from the server
        const response = await fetch("http://localhost:8000/live/invoke/abTest", {
            credentials: 'include'
        });
        const result = await response.json();
        flags = result.flags
    }

    const jsToRun = result.injectedScript
    const cssToAdd = result.injectedStyle
    const elementsToTrack = result.trackedElements

    addPlausible()

    runJS(jsToRun)
    addCSS(cssToAdd)
    trackElements(elementsToTrack, flags)

    // wait plausible load
    await sleep(100)

    globalThis.window.DECO = globalThis.window.DECO || {};
    globalThis.window.DECO.sendEvent = (name, props) => {
        globalThis.window.plausible?.(name, {
            props:{
                ...(props || {}),
                ...flags
            }
        });
    }


    const trackPageview = () => globalThis.window.DECO.sendEvent?.("pageview");
    // First pageview
    trackPageview()
    
}

fetchScript()

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
