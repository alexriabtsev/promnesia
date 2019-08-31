/* @flow */

type Tag = string;

type TagMap = {
    [Tag]: Tag
};

export type Options = {
    host: string;
    token: string;

    dots: boolean;
    blacklist: string;
    tag_map: TagMap;

    position_css: string;
    extra_css: string;

}

// TODO how to export settings?? seriously need some standard package for settings
function default_options(): Options {
    return {
        host: 'http://localhost:13131',
        token: '',

        dots: true,
        blacklist: '',
        tag_map: {},

        // TODO FIXME do something if value is invalid?..
        // TODO make it literate from test?
        position_css: `
/* Change these if you want to reposition the sidebar
 * E.g. to display on bottom, use
 * #wereyouhere-sidebar { left: 0; bottom: 0; height: 20%; } TODO fix in test
 */
#wereyouhere-sidebar {
    --right: 1;
    --size : 30%;

    /*
TODO move non repeat scroll to bundled?
    */
    background: rgba(236, 236, 236, 0.4) none repeat scroll 0% 0%;
}
`.trim(),
        // TODO if height is not present assume 100%? I guess that's kinda reasonable...

        // TODO add some docs on configuring it...
        // TODO set it from sidebar.css?
        extra_css   : `
.tag {
    color: orange;
}
`.trim(),
    };
}

export function get_options(cb: (Options) => void)  {
    // TODO make it as minimal as possible; rest should be async
    chrome.storage.local.get(null, res => {
        const optss = res.options || '{}';
        const saved_opts = JSON.parse(optss);
        const opts = {...default_options(), ...saved_opts};
        cb(opts);
    });
}


function create_promise<T>(provider: ((T) => void) => void): Promise<T> {
    return new Promise((resolve, reject) => {
        try {
            provider(resolve);
        } catch (err) {
            reject(err);
        }
    });
}

// TODO later rename to just get_options
export async function get_options_async(): Promise<Options> {
    return await create_promise(get_options);
}

export async function setOptions(opts: Options) {
    // ugh. making sure every field is a string is too annoying
    // just easier to store on big settings payload?
    // TODO can we even store array in local store???
    const optss = JSON.stringify(opts);
    console.log('Saving %s', optss);

    await new Promise(cb => chrome.storage.local.set({'options': optss}, cb));
}
