
import { useSession, signIn } from 'next-auth/react';
import { api } from '../../services/api';
import styles from './styles.module.scss';
import { getStripeJs } from '../../services/stripes-js';
import { useRouter } from 'next/router';

interface SubscribeButtonProps {
    priceId: string;

}

// getServerSideProps (SSR)
// getStaticProps (SSG)
// API routes

export function SubscribeButton( { priceId }: SubscribeButtonProps) {
    
    const { data: session } = useSession();
    const router = useRouter();

    async function HandleSubscribe() {
        if (!session) {
            signIn('github')
            return;
        }

        if (session?.activeSubscription) {
            router.push('/posts');
            return
        }

        try {
            const response = await api.post('/subscribe');

            const { sessionId } = response.data;
        
            const stripe = await getStripeJs()

            stripe.redirectToCheckout({ sessionId })
        }
        
        catch (err) {
            alert(err.message)
        }
    }

    return  (
       <button 
       className={styles.subscribeButton} 
       type="button"
        onClick={HandleSubscribe}
        >
           Subscribe now
        
       </button>
    ) 
}