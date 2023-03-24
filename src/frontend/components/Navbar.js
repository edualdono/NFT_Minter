import { Link } from "react-router-dom";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import nft from './nft.png';

//el signo ? en la linea 33 significa en caso de que eso sea cierto entonces

const Navigation = ({ web3Handler, account }) => {
    return (
        <Navbar expand='lg' bg='primary' variant='dark'>
            <Container>
                <Navbar.Brand>
                    <img src={nft} width='40' height='40' className="" alt="" />
                    &nbsp;
                    NFT Minter
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar navbar-dark bg-primary" />
                <Navbar.Collapse id="navbar navbar-dark bg-primary">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">
                            Create
                        </Nav.Link>
                    </Nav>
                    <Nav>
                        {account ? (
                            <Nav.Link
                                href={`https://etherscan.io/address/${account}`}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='button nav-button btn-sm mx-4'>
                                <Button variant='outline-light'>
                                    {account}
                                </Button>
                            </Nav.Link>
                        ) : (
                            <Button onClick={web3Handler} variant='outline-light'>
                                Connect Wallet
                            </Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Navigation;