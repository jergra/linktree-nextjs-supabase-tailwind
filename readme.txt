Feb 20, 2023

C:/dev/linktree-nextjs-supabase-tailwind

from tutorial:
    Code A Linktree Clone With React, NextJS, TailwindCSS, And Supabase (Full Coding Tutorial)
    https://www.youtube.com/watch?v=Pbr7M4c9O3Q&t=11s&ab_channel=YourAverageTechBro

    by Your Average Tech Bro

start:
    npm run dev

deployed:
    https://linktree-nextjs-supabase-tailwind.vercel.app/

update:
    git add .
    git commit -m 'message'
    git push


.env.local has these environmental variables:
    NEXT_PUBLIC_SUPABASE_URL=
    NEXT_PUBLIC_SUPABASE_ANON_KEY=

at supabase there are two tables:

'links':

id          int8
created_at  timestamptz     now()
title       varchar
url         varchar
user_id     varchar

'users':

id                      uuid
created_at              timestamptz     now()
profile_picture_url     varchar
username                varchar

Row Leve Security (RLS) is turned off for both tables.

The 'id' for the 'users' tables is a foreign key. 
Under foreign key, select 'auth' scheme.
Select 'users' table to reference to. 
Select 'id' column from 'users' to reference to.

Under 'storage' create a bucket called 'public'. 
Turn on 'Public bucket'. 
Under 'Policies', under 'Other policies under storage.objects', 
create a 'New policy'.
Choose 'full customization'.
Choose 'ALL'.
'USING expression', type 'true' 
'WITH CHECK expression', type 'true' 


