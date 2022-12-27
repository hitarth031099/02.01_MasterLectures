import { gql } from '@apollo/client';

const home = gql`
    query UnsplashImages($pageNum: Int) {
        unsplashImages(pageNum: $pageNum) {
            id
            url
            posterName
            description
            userPosted
            binned
            numBinned
        }
    }
`;

const mybin = gql`
    query binnedImages{
        binnedImages{
            id
            url
            posterName
            description
            userPosted
            binned
            numBinned
        }
    }
`;

const myposts = gql`
    query userPostedImages{
        userPostedImages{
            id
            url
            posterName
            description
            userPosted
            binned
            numBinned
        }
    }
`;

const updateImage = gql`
    mutation UpdateImage(
        $updateImageId: ID!, 
        $url: String, 
        $posterName: String, 
        $description: String, 
        $userPosted: Boolean, 
        $binned: Boolean
    ) {
        updateImage(id: $updateImageId, url: $url, posterName: $posterName, description: $description, userPosted: $userPosted, binned: $binned) {
            id
            url
            posterName
            description
            userPosted
            binned
            numBinned
        }
    }
`;

const uploadImage = gql`
    mutation UploadImage($url: String!, $description: String, $posterName: String) {
        uploadImage(url: $url, description: $description, posterName: $posterName) {
            id
            url
            posterName
            description
            userPosted
            binned
            numBinned
        }
    }
`

const deleteImage = gql`
    mutation DeleteImage($deleteImageId: ID!) {
        deleteImage(id: $deleteImageId) {
            id
        }
    }
`

const exported = {
    home: home,
    mybin: mybin,
    myposts: myposts,
    updateImage: updateImage,
    uploadImage: uploadImage,
    deleteImage: deleteImage
};

export default exported;
