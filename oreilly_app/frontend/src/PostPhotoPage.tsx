import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import MainTemplate from "./components/MainTemplate";

const POST_PHOTO_MUTATION = gql`
  mutation postPhoto($input: PostPhotoInput!) {
    postPhoto(input: $input) {
      name
      id
      url
    }
  }
`;

const PostPhotoPage = () => {
  const [photo, setPhoto] = useState<File | null>(null);

  const [mutate] = useMutation(POST_PHOTO_MUTATION);

  console.log("render");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (photo === null) return;

		
    await mutate({
      variables: {
        input: {
          name: photo.name,
          file: photo,
        },
      },
    }).catch(e => {
			console.log(e)
		});
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      setPhoto(e.currentTarget.files[0]);
    }
  };

  return (
    <MainTemplate>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleOnChange} />
        <button type="submit">submit</button>
      </form>
    </MainTemplate>
  );
};

export default PostPhotoPage;
