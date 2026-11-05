'use client';

import { useParams } from 'next/navigation';
import WebsiteForm from '@/components/Admin/WebsiteForm';

export default function EditWebsitePage() {
    const { id } = useParams();
    return <WebsiteForm id={id} />;
}
