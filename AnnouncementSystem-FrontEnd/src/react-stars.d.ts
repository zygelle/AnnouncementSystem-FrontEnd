declare module 'react-stars' {
    import { Component } from 'react';

    interface ReactStarsProps {
    count?: number;
    value?: number;
    size?: number;
    color1?: string;
    color2?: string;
    onChange?: (newRating: number) => void;
    edit?: boolean;
    half?: boolean;
    }

    export default class ReactStars extends Component<ReactStarsProps> {}
}  