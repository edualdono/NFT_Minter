import { useState } from "react";
import { ethers } from "ethers";
import { Row, Form, Button } from "react-bootstrap";
import Swal from 'sweetalert2';
import {create as ipfsHttpClient} from 'ipfs-http-client';
import { Buffer } from 'buffer';

const projectId = '2JIIDzbL09PNGuMgQLSzjk0aTF4';
const projectSecret = 'b115fa9449402b92e0cee1ce3d8b3fad';
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

//const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

const client = ipfsHttpClient({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    apiPath: '/api/v0',
    headers: {
        authorization: auth
    }
});

const Create = ({ nft }) => {
    const [image, setImage] = useState('');
    const [price, setPrice] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const uploadToIPFS = async (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        if (typeof file !== 'undefined') {
            try {
                const result = await client.add(file);
                console.log(result);
                setImage(`https://ipfs.io/ipfs/${result.path}`)
            } catch (error) {
                console.log('ipfs image upload error: ', error);
            }
        }
    }
    const createNFT = async () => {
        if (!image || !price || !name || !description) return
        try {
            const result = await client.add(JSON.stringify({ image, price, name, description }));
            mintThenList(result);
            Swal.fire({
                icon: 'success',
                title: '¡NFT Deployed!',
                width: 800,
                padding: '3em',
                text: ` Your NFT with name: ${name} with a value of:  ${price} ETH/s was deploy`,
                backdrop: `
          rgba(15, 238, 168, 0.2)
          left top
          no-repeat
        `
            })
        } catch (error) {
            console.log('ipfs uri upload error: ', error);
        }
    }

    const mintThenList = async (result) => {
        const uri = `https://ipfs.io/ipfs/${result.path}`
        await (await nft.mint(uri)).wait();
        const id = await nft.tokenCount();
        //await (await nft.setApprovalForAll(marketplace.address, true));
        //const listingPrice = ethers.utils.parseEther(price.toString());
        //await (await marketplace.makeItem(nft.address, id, listingPrice)).wait();
    }

    return (
        <div className="container-fluid mt-5">
            <div className="row">
                <main role='main' className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
                    <div className="content mx-auto">
                        <Row className="g-4">
                            <Form.Control
                                type='file'
                                required
                                name='file'
                                onChange={uploadToIPFS} />
                            <Form.Control onChange={(e) => setName(e.target.value)}
                                size='lg'
                                required
                                type='text'
                                placeholder="Name" />
                            <Form.Control onChange={(e) => setDescription(e.target.value)}
                                size='lg'
                                required
                                as='textarea'
                                placeholder="Description" />
                            <Form.Control onChange={(e) => setPrice(e.target.value)}
                                size='lg'
                                required
                                type='number'
                                placeholder="Price (ETH)" />
                            <div className="g-grid px-0">
                                <Button onClick={createNFT}
                                    variant='primary'
                                    size="lg">
                                    Create and list NFT
                                </Button>
                            </div>
                        </Row>
                    </div>
                </main>
            </div>
        </div>
    );

}

export default Create;