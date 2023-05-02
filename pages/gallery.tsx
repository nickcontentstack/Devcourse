import React from 'react';
import { getSuperheroGallery, getSuperheroGalleryRes } from '../helper';
import { PostPage, Context } from "../typescript/pages";
import { Posts } from '../typescript/layout';
import { getDynamicSuperheroGallery } from '../helper';
import Gallery from '../components/gallery'
import HeroBanner from '../components/hero-banner';
import { Banner } from '../typescript/component';

const renderTemplateSection = (switchData: any[], modules: {
    hero_banner: Banner;
    super_heroes_gallery: { heroes: [], heading: string | undefined };

}) => {
    const {
        super_heroes_gallery: superHeroGallery
    } = modules

    switch (switchData[0]) {
        case 'hero_banner':
            return (
                <HeroBanner banner={modules.hero_banner} />
            )
        case 'super_heroes_gallery':
            return (
                <Gallery data={superHeroGallery?.heroes} heading={superHeroGallery?.heading} showFilter />
            )

        default: return null
    }
}

export default function SuperHerosGallery({ gallery, superHerogallery }: { gallery: Posts, superHerogallery: Posts }) {
    let superGalleryRespArray: any[] = []
    let selectedBySuperPower: any[] = []
    let filterPower: any;
    let numberToDisplay: any;

    superHerogallery?.modular_blocks?.map((getallHeros: any) => {
        if (getallHeros?.super_heroes_gallery_api_) {
            superGalleryRespArray.push(getallHeros?.super_heroes_gallery_api_?.heroes)
        }
    })

    superHerogallery?.modular_blocks?.map((blocks: any) => {
        if (blocks?.dynamic_hero_list) {
            blocks?.dynamic_hero_list?.parameters?.superpowers ?
                filterPower = blocks?.dynamic_hero_list?.parameters?.superpowers : ''
            numberToDisplay = blocks?.dynamic_hero_list?.parameters?.number_to_display
            let counter = 0
            superGalleryRespArray[0]?.map((heroes: any) => {

                if (heroes.powers[0] === filterPower) {
                    if (counter < numberToDisplay) {
                        selectedBySuperPower.push(heroes)
                        counter++
                    }
                }
            })
        }
    })

    return (
        <div className='container'>
            {
                gallery?.modular_blocks
                    ?.map((ele: any) => renderTemplateSection(Object.keys(ele), ele,))
            }
            {selectedBySuperPower.length > 0 && (
                <Gallery data={selectedBySuperPower} heading="" showFilter={false} />
            )}
        </div>
    );
}

export async function getServerSideProps(context: { resolvedUrl: any; }) {
    try {
        const superHeroAPI = await getDynamicSuperheroGallery();
        const superHerogallery = superHeroAPI[0]
        const gallery = await getSuperheroGallery(context.resolvedUrl);
        const result: PostPage = await getSuperheroGalleryRes();
        const archivePost = [] as any;
        const posts = [] as any;

        result.forEach((SuperHerosGallery: { is_archived: any; }) => {
            if (SuperHerosGallery.is_archived) {
                archivePost.push(SuperHerosGallery);
            } else {
                posts.push(SuperHerosGallery);
            }
        });
        return {
            props: {
                pageUrl: context.resolvedUrl,
                gallery,
                posts,
                superHerogallery,
            },
        };
    } catch (error) {
        console.error(error);
        return { notFound: true };
    }
}