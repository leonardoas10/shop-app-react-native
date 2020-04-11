import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, Button, Text, Platform, ActivityIndicator, View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';
import * as ordersActions from '../../store/actions/order';
import Colors from '../../constants/Colors';

const OrdersScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const orders = useSelector(state => state.orders.orders);
    const dispatch = useDispatch();

    const loadOrders = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            await dispatch(ordersActions.fetchOrders());
        } catch (error) {
            setError(error.message);
        }
        setIsLoading(false);
    }, [dispatch, setIsLoading, setError])

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large' color={Colors.primary} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text>{error}</Text>
                <Button
                    title="Try Again!"
                    onPress={loadOrders}
                    color={Colors.primary}
                />
            </View>
        )
    }

    if (orders.length === 0) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>No orders found, maybe start creating some orders?</Text>
            </View>
        )
    }

    return (
        <FlatList
            data={orders}
            renderItem={itemData => (
                <OrderItem
                    amount={itemData.item.totalAmount}
                    date={itemData.item.readableDate}
                    items={itemData.item.items}
                />
            )}
        />
    );
};

OrdersScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Your Orders',
        headerLeft: <HeaderButtons HeaderButtonComponent={HeaderButton} >
            <Item
                title='Menu'
                iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                onPress={() => {
                    navData.navigation.toggleDrawer();
                }}
            />
        </HeaderButtons>,
    }
};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default OrdersScreen;