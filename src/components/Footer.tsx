/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';

const FooterContainer = styled.footer`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #2c3e50, #34495e);
    color: white;
    z-index: 1000;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s ease;

    &:hover {
        background: linear-gradient(135deg, #34495e, #2c3e50);
    }
`;

const FooterText = styled.p`
    font-size: 0.9rem;
    font-weight: 500;
    color: #ecf0f1;
    margin: 0;
    transition: color 0.3s ease;

    &:hover {
        color: #1abc9c;
    }
`;

const FooterLink = styled.a`
    color: inherit;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
        color: #1abc9c;
    }
`;

export const Footer = () => {
    return (
        <FooterContainer>
            <FooterText>
                <FooterLink href="t.me/ilyaglbv" target="_blank" rel="noopener noreferrer">
                    Илья Голубев @ilyaglbv 2025
                </FooterLink>
            </FooterText>
        </FooterContainer>
    );
};