import React, { useState, useEffect } from 'react';
import { onEntryChange } from '../../contentstack-sdk';
import RenderComponents from '../../components/render-components';
import Link from 'next/link';
import parse from 'html-react-parser';
import { getSuperhero, getsuperheroHomeWorldRes } from '../../helper';
import Skeleton from 'react-loading-skeleton';
import { Page, PostPage, PageUrl, Context } from "../../typescript/pages";
import moment, { MomentInput } from 'moment';

export function DescriptiveText(data: { data: string; }) {
  let body: string = data?.data && data?.data?.substr(0, 150);
  const stringLength = body?.lastIndexOf(' ');
  body = `${body?.substr(0, Math.min(body.length, stringLength))}...`;
  return (<p {...body as {}}>{parse(body)}</p>)
}

export default function SuperHeros({ page, posts, archivePost, pageUrl }: { page: Page, posts: PostPage, archivePost: PostPage, pageUrl: PageUrl }) {


  const [getBanner, setBanner] = useState(page);
  async function fetchData() {
    try {
      const bannerRes = await getSuperhero(pageUrl);
      if (!bannerRes) throw new Error('Status code 404');
      setBanner(bannerRes);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    onEntryChange(() => fetchData());
  }, []);
  return (
    <>
      {getBanner.page_components ? (
        <RenderComponents
          pageComponents={getBanner.page_components}
          // blogPost
          contentTypeUid='page'
          entryUid={getBanner.uid}
          locale={getBanner.locale}
        />
      ) : (
        <Skeleton height={400} />
      )}
      <div className='container  mt-5'>
        <div className='row justify-content-center'>
          {posts ? (
            posts[0].map((superHeroList: {
              title: JSX.Element;
              image: { url: string | undefined; $: { url: {}; }; filename: string; };
              url: string;
              date: moment.MomentInput;
              description: string;
            },
              index: {}) => (
              <div className='mb-4 col-4 flex-column mt-2' key={index.toString()}>
                <div className='superHero-sec-wrap'>
                  <div className='imag-wrap'>
                    {superHeroList?.image ? (
                      <Link href={superHeroList?.url}>
                        <a>
                          <img
                            className='superHero-card img-fluid'
                            src={superHeroList?.image?.url}
                            alt={superHeroList?.image?.filename}
                            {...superHeroList?.image.$?.url as {}}
                          />
                        </a>
                      </Link>
                    ) : ''}
                  </div>

                  <div className='mt-3 px-2 mb-3'>
                    {superHeroList?.title && (
                      <Link href={superHeroList.url}>
                        <a>
                          <h3>{superHeroList?.title}</h3>
                        </a>
                      </Link>
                    )}
                    <p>
                      <strong>
                        {moment(superHeroList.date).format('ddd, MMM D YYYY')}
                      </strong>
                      ,{" "}
                    </p>
                    <DescriptiveText data={superHeroList?.description} />
                    {superHeroList.url ? (
                      <Link href={superHeroList.url}>
                        <a className='readmore-url'>
                          <span>{'Read more -->'}</span>
                        </a>
                      </Link>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <Skeleton height={400} width={400} count={3} />
          )}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: Context) {
  try {
    const page = await getSuperhero(context.resolvedUrl);
    const result: PostPage = await getsuperheroHomeWorldRes();

    const archivePost = [] as any;
    const posts = [] as any;
  
    result.forEach((superHero) => {
      if (superHero.is_archived) {
        archivePost.push(superHero);
      } else {
        posts.push(superHero);
      }
    });
    return {
      props: {
        pageUrl: context.resolvedUrl,
        page,
        posts,
        archivePost,
      },
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
}
