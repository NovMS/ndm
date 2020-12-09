import React from 'react'
import styled from 'styled-components';
import { useDropzone } from "react-dropzone";

const StDiv = styled.div`
    position : fixed;
    top : calc( ${ props => props.size[1]/2}px - 29.5vmin );
    left : calc( ${ props => props.size[0]/2}px - 29.5vmin ) ;
    background-color : rgba(240, 240, 240, 1);
    height : 59vmin;
    width : 59vmin;
    border-radius : 100%;
    outline: none;
    text-align: center;
    display: flex;
    & > p {
        align-self : center;
        color : grey;
        font-size : 5vmin;
    }
`;

const DropZone = ({ onDrop, accept , size })=>{

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept
      });


    return(
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            <StDiv size={size}>
            {isDragActive ? (
                <p> Отпустите изображение, чтобы загрузить его</p>
            ) : (
                <p> 
                Пожалуйста, перетащите изображение в данную область
                </p>
            )}
            </StDiv>
        </div>
    )
}

export default DropZone