import { createClient } from 'contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Image from 'next/image';
import Fallback from '../../components/Fallback';

const space = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

const client = createClient({
  space: space,
  accessToken: accessToken,
});

export const getStaticPaths = async () => {
  const resp = await client.getEntries({
    content_type: 'recipe',
  });
  const paths = resp.items.map((item) => {
    return {
      params: { slug: item.fields.slug },
    };
  });

  return {
    paths: paths,
    fallback: true,
  };
};

export async function getStaticProps({ params }) {
  const { items } = await client.getEntries({
    content_type: 'recipe',
    'fields.slug': params.slug,
  });
  
  if (!items.length) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      recipe: items[0],
      revalidate: 5000,
    },
  };
}

export default function RecipeDetails({ recipe }) {
  if (!recipe) return <Fallback />;

  const { featuredImage, title, cookingTime, ingredients, steps } =
    recipe.fields;

  return (
    <div>
      <div className='banner'>
        <div className='fImage'>
          <Image
            src={`https://${featuredImage.fields.file.url}`}
            width={featuredImage.fields.file.details.image.width}
            height={featuredImage.fields.file.details.image.height}
          />
        </div>
        <h2>{title}</h2>
        <div className='info'>
          <h3>Cooking time</h3>
          <p>{cookingTime}</p>

          <h3>Ingredients</h3>
          <ul>
            {ingredients.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h3>Steps</h3>
          <div>{documentToReactComponents(steps)}</div>
        </div>
      </div>
      <style jsx>{`
        .fImage {
          width: 100%;
        }
        h2,
        h3 {
          text-transform: uppercase;
        }
        .banner h2 {
          margin: 0;
          // background: #fff;
          display: inline-block;
          padding: 20px;
          position: relative;
          top: -10px;
          left: 0px;
          // box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.1);
          right: 0px;
        }
        .info p {
          margin: 0;
        }
        .info span::after {
          content: ', ';
        }
        .info span:last-child::after {
          content: '.';
        }
      `}</style>
    </div>
  );
}
