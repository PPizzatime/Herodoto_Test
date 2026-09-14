DO $$
DECLARE
    guide_record RECORD;
BEGIN
    FOR guide_record IN 
        SELECT DISTINCT ON (title) title, guide_id 
        FROM public.guide_versions 
        WHERE title IN (
            'MARCO Monterrey',
            'Museo Soumaya',
            'Palenque Ruins',
            'Chichen Itza',
            'Tulum Ruins',
            'British Museum',
            'Prado Museum',
            'Uffizi Gallery',
            'Colosseum',
            'Taj Mahal'
        )
    LOOP
        -- Default image based on title
        IF guide_record.title = 'MARCO Monterrey' THEN
            INSERT INTO public.guide_images (guide_id, image_url, status) VALUES (guide_record.guide_id, 'https://images.unsplash.com/photo-1579227521743-fba0ba0fcf0e?q=80&w=2000&auto=format&fit=crop', 'APPROVED') ON CONFLICT DO NOTHING;
            INSERT INTO public.guide_images (guide_id, image_url, status) VALUES (guide_record.guide_id, 'https://images.unsplash.com/photo-1555029302-3904bb152865?q=80&w=2000&auto=format&fit=crop', 'APPROVED') ON CONFLICT DO NOTHING;
        ELSIF guide_record.title = 'Museo Soumaya' THEN
            INSERT INTO public.guide_images (guide_id, image_url, status) VALUES (guide_record.guide_id, 'https://images.unsplash.com/photo-1580211717387-57353f2c7a52?q=80&w=2000&auto=format&fit=crop', 'APPROVED') ON CONFLICT DO NOTHING;
            INSERT INTO public.guide_images (guide_id, image_url, status) VALUES (guide_record.guide_id, 'https://images.unsplash.com/photo-1616422285623-14dd8f3a3a9a?q=80&w=2000&auto=format&fit=crop', 'APPROVED') ON CONFLICT DO NOTHING;
        ELSIF guide_record.title = 'Palenque Ruins' THEN
            INSERT INTO public.guide_images (guide_id, image_url, status) VALUES (guide_record.guide_id, 'https://images.unsplash.com/photo-1518623380242-d992d3c15b1c?q=80&w=2000&auto=format&fit=crop', 'APPROVED') ON CONFLICT DO NOTHING;
            INSERT INTO public.guide_images (guide_id, image_url, status) VALUES (guide_record.guide_id, 'https://images.unsplash.com/photo-1596766440810-cbca8bfa51c8?q=80&w=2000&auto=format&fit=crop', 'APPROVED') ON CONFLICT DO NOTHING;
        ELSIF guide_record.title = 'Chichen Itza' THEN
            INSERT INTO public.guide_images (guide_id, image_url, status) VALUES (guide_record.guide_id, 'https://images.unsplash.com/photo-1518182170546-076616fdfaaf?q=80&w=2000&auto=format&fit=crop', 'APPROVED') ON CONFLICT DO NOTHING;
            INSERT INTO public.guide_images (guide_id, image_url, status) VALUES (guide_record.guide_id, 'https://images.unsplash.com/photo-1579450376840-02ba44db3be8?q=80&w=2000&auto=format&fit=crop', 'APPROVED') ON CONFLICT DO NOTHING;
        ELSIF guide_record.title = 'Tulum Ruins' THEN
            INSERT INTO public.guide_images (guide_id, image_url, status) VALUES (guide_record.guide_id, 'https://images.unsplash.com/photo-1510967756627-2e8675128080?q=80&w=2000&auto=format&fit=crop', 'APPROVED') ON CONFLICT DO NOTHING;
            INSERT INTO public.guide_images (guide_id, image_url, status) VALUES (guide_record.guide_id, 'https://images.unsplash.com/photo-1563200922-411bd1f0cf87?q=80&w=2000&auto=format&fit=crop', 'APPROVED') ON CONFLICT DO NOTHING;
        ELSIF guide_record.title = 'British Museum' THEN
            INSERT INTO public.guide_images (guide_id, image_url, status) VALUES (guide_record.guide_id, 'https://images.unsplash.com/photo-1561726002-86927a372138?q=80&w=2000&auto=format&fit=crop', 'APPROVED') ON CONFLICT DO NOTHING;
            INSERT INTO public.guide_images (guide_id, image_url, status) VALUES (guide_record.guide_id, 'https://images.unsplash.com/photo-1579227658797-152e04313f01?q=80&w=2000&auto=format&fit=crop', 'APPROVED') ON CONFLICT DO NOTHING;
        ELSIF guide_record.title = 'Prado Museum' THEN
            INSERT INTO public.guide_images (guide_id, image_url, status) VALUES (guide_record.guide_id, 'https://images.unsplash.com/photo-1627993414963-324da57e4e69?q=80&w=2000&auto=format&fit=crop', 'APPROVED') ON CONFLICT DO NOTHING;
            INSERT INTO public.guide_images (guide_id, image_url, status) VALUES (guide_record.guide_id, 'https://images.unsplash.com/photo-1565158674996-a0684f50f242?q=80&w=2000&auto=format&fit=crop', 'APPROVED') ON CONFLICT DO NOTHING;
        ELSIF guide_record.title = 'Uffizi Gallery' THEN
            INSERT INTO public.guide_images (guide_id, image_url, status) VALUES (guide_record.guide_id, 'https://images.unsplash.com/photo-1588636400030-9b69b9f71c4c?q=80&w=2000&auto=format&fit=crop', 'APPROVED') ON CONFLICT DO NOTHING;
            INSERT INTO public.guide_images (guide_id, image_url, status) VALUES (guide_record.guide_id, 'https://images.unsplash.com/photo-1559564619-38b4566ec480?q=80&w=2000&auto=format&fit=crop', 'APPROVED') ON CONFLICT DO NOTHING;
        ELSIF guide_record.title = 'Colosseum' THEN
            INSERT INTO public.guide_images (guide_id, image_url, status) VALUES (guide_record.guide_id, 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=2000&auto=format&fit=crop', 'APPROVED') ON CONFLICT DO NOTHING;
            INSERT INTO public.guide_images (guide_id, image_url, status) VALUES (guide_record.guide_id, 'https://images.unsplash.com/photo-1594917578351-40149021815d?q=80&w=2000&auto=format&fit=crop', 'APPROVED') ON CONFLICT DO NOTHING;
        ELSIF guide_record.title = 'Taj Mahal' THEN
            INSERT INTO public.guide_images (guide_id, image_url, status) VALUES (guide_record.guide_id, 'https://images.unsplash.com/photo-1564507592208-0284400c4103?q=80&w=2000&auto=format&fit=crop', 'APPROVED') ON CONFLICT DO NOTHING;
            INSERT INTO public.guide_images (guide_id, image_url, status) VALUES (guide_record.guide_id, 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2000&auto=format&fit=crop', 'APPROVED') ON CONFLICT DO NOTHING;
        END IF;
    END LOOP;
END $$;
