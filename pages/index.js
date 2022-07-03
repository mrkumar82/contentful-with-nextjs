import { createClient } from 'contentful';
import RecipeCard from '../components/RecipeCard';

const space = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

export async function getStaticProps() {
  const client = createClient({
    space: space,
    accessToken: accessToken,
  });
  const resp = await client.getEntries({
    content_type: 'recipe',
  });
  return {
    props: {
      recipes: resp.items,
      revalidate: 5000,
    },
  };
}

export default function Recipes({ recipes }) {
  const { fields } = recipes;
  return (
    <div className='recipe-list'>
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.sys.id} recipe={recipe} />
      ))}

      <style jsx>{`
        .recipe-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-gap: 20px 60px;
        }
      `}</style>
    </div>
  );
}
