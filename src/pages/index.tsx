import dynamic from 'next/dynamic';
import * as React from 'react';
import { Suspense } from 'react';

import Layout from '@/components/layout/Layout';
import UnderlineLink from '@/components/links/UnderlineLink';
import UnstyledLink from '@/components/links/UnstyledLink';
import NextImage from '@/components/NextImage';
import Seo from '@/components/Seo';

const chats = [
  'Hi',
  'Hello',
  "How're you?",
  'I am doing well. What is about you?',
];

const TextEditor = dynamic(() => import('@/components/DraftEditor'), {
  ssr: false,
});

export default function HomePage() {
  return (
    <Layout>
      <Seo />
      <main className='h-screen overflow-hidden'>
        <section className='wrapper h-full bg-white'>
          <div className='flex items-center p-4'>
            <UnstyledLink href='/' className='mr-4 mb-2'>
              <NextImage
                useSkeleton
                className='w-16 md:w-20'
                src='/favicon/apple-icon-180x180.png'
                width='80'
                height='80'
                alt='Icon'
              />
            </UnstyledLink>
            <h2 className='mb-2'>Mateo Chat</h2>
          </div>
          <div className='chat-container layout mb-40 h-full'>
            <div className='chats min-hcontent mb-12 flex h-1/2 max-h-max flex-grow flex-col items-end border-r-2 border-primary-400 pt-2 pb-2 pr-6'>
              <div className='flex flex-col items-end overflow-auto pr-6'>
                {chats.map((text, i) => (
                  <div
                    className='flex justify-end'
                    key={`${i}-${Math.random()}`}
                  >
                    <div className='mr-4 text-right'>
                      <p className='mb-2 text-gray-600'>{text}</p>
                      <p className='mb-6 text-right text-xs text-gray-400'>
                        {new Date(Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                    <NextImage
                      useSkeleton
                      className='mt-1 h-8 w-8 rounded-full bg-white shadow'
                      src='/'
                      width='40'
                      height='40'
                      alt=''
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className='composer flex w-full'>
              <div className='composer flexx w-1/2 flex-wrap items-end justify-between rounded-lg bg-primary-300 p-6'>
                <div className='bg-white'>
                  <Suspense fallback='loading...'>
                    <TextEditor />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className='absolute bottom-2 w-full p-4 text-center text-sm text-gray-700'>
          © {new Date().getFullYear()} By{' '}
          <UnderlineLink href='https://theodorusclarence.com?ref=tsnextstarter'>
            Theodorus Clarence
          </UnderlineLink>
        </footer>
      </main>
    </Layout>
  );
}
