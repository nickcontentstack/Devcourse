import React, { useEffect, useState } from 'react';
import moment from 'moment';
import parse from 'html-react-parser';
import { getSuperheroGallery, getSuperHeroSingleRes } from '../../helper';
import { onEntryChange } from '../../contentstack-sdk';
import { Page, SuperHeroPosts, PageUrl } from "../../typescript/pages";


export default function SuperHerosPost({ superHeroPost, page, pageUrl }: { superHeroPost: SuperHeroPosts, page: Page, pageUrl: PageUrl }) {

  const postData = superHeroPost

  const [getPost, setPost] = useState({ banner: page, post: superHeroPost });
  async function fetchData() {
    try {
      const entryRes = await getSuperheroGallery(pageUrl);

      const bannerRes = await getSuperheroGallery('/superheroes');
      if (!entryRes || !bannerRes) throw new Error('Status: ' + 404);
      setPost({ banner: bannerRes, post: entryRes });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    onEntryChange(() => fetchData());
  }, [superHeroPost]);

  const { post, banner } = getPost;

  return (
    <>
      {/* {banner ? (
        <RenderComponents
          pageComponents={banner.page_components}
          blogPost
          contentTypeUid='blog_post'
          entryUid={banner?.uid}
          locale={banner?.locale}
        />
      ) : (
        <Skeleton height={400} />
      )} */}
      <div className='container superHero-detail-container'>
        <img
          className='superHero-detail-img img-fluid mb-5'
          src={postData?.image.url}
          alt={postData?.image?.filename}
          {...postData?.image.$?.url as {}}
        />
        <div className='row justify-content-between'>
          <div className='col-12 col-md-8'>
            <h2 className='mb-3'>{postData?.title}</h2>
            <p>{parse(postData?.description)}</p>

          </div>
          <div className='col-12 col-md-3 mt-5 ps-md-5'>
            {
              postData?.home_world?.map((homeWorld: {
                title: string | undefined;
                image: { url: string | undefined; $: { url: {}; }; filename: string; };
              },
                indx: {}) => (
                <div key={indx.toString()} className="mb-3">
                  {homeWorld?.title ? <p><strong>{homeWorld?.title}</strong></p> : ''}
                  {homeWorld?.image?.url ?
                    <img
                      className='superHero-logo-img img-fluid mb-3'
                      src={homeWorld?.image?.url}
                      alt={homeWorld?.image?.filename}
                    />
                    : ''}
                  <hr />
                </div>
              ))
            }
            {postData?.contact_info?.email ? <p><strong>Email :</strong> {postData?.contact_info?.email}</p> : ''}
            {postData?.contact_info?.phone ? <p><strong>Phone :</strong> {postData?.contact_info?.phone}</p> : ''}
            {postData?.powers[0] ? <p><strong>Power :</strong> {postData?.powers}</p> : ''}
          </div>
        </div>
      </div>
    </>
  );
}
export async function getServerSideProps({ params }: any) {
  try {
    // const page = await getSuperheroGallery('/superhero');
    const posts = await getSuperHeroSingleRes(`/superheroes/${params.post}`);

    if (!posts) throw new Error('404');

    return {
      props: {
        pageUrl: `/superheroes/${params.post}`,
        superHeroPost: posts,
        // page,
      },
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
}
