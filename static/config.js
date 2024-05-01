
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

function runConfigurations(configurations){
    configurations.forEach((config) => {
        if(config.props.jsToRun){
            eval(config.props.jsToRun)
        }
    })
}

async function fetchScript(){
    const response = await fetch("http://localhost:8000/live/invoke/config", {
        credentials: 'include'
    });

    const result = await response.json();
    const flags = result.flags || {}

    const configurations = result.configurations || []

    runConfigurations(configurations)

    addPlausible()

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
