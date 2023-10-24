import { RouteProp } from '@react-navigation/native';

type RootStackParams = {
    SubCollection: {
        parentId: number;
        title: string;
    };
};

export type SubCollectionRouteProp = RouteProp<RootStackParams, 'SubCollection'>;
