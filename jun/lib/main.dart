
import 'package:flutter/material.dart';


void main () {
    runApp(
         new MaterialApp(
            title: 'text demo', 
            home: new ContainerDemo()
        )
    );
}

/* 
void main() => runApp(MyAPP());
class MyApp extends StatelessWidget {
    @override
    Widget build(BuildContext context) {
        return MaterialApp(  
            title: '第一个demo',
            home: Scaffold (
                body: Center(
                    child: Container(
                        child: Text(
                            'flutter',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                                fontSize: 20
                            )
                        ),
                    ),
                ),
                appBar: AppBar (title: Text('容器组件')), 
            )
        );
    }
} */

/* class MyApp extends StatelessWidget {
    @override
    Widget build(BuildContext context){
        return new MaterialApp(
            title: '图片组件',
            home: new Center(
                child: new Image.network(
                    'https://pic12.secooimg.com/res/contentERP/6e10f9dda5964c0cbd086d40825472f9.png',
                    fit: BoxFit.cover
                )
            )
        );
    }
} */

class ContainerDemo extends StatelessWidget {
    @override
    Widget build(BuildContext context) {
        return new Scaffold (
            appBar: new AppBar(
                title: new Text('文本组件')
            ),
            body: new Column(
                children: <Widget>[
                    new Text(
                        '红色黑色25号字',
                        style: new TextStyle(
                            fontSize: 25,
                            color: const Color(0xffff0000),
                            decoration: TextDecoration.lineThrough,
                            decorationColor: const Color(0xff000000)
                        )
                    ),
                    new Text(
                        '红色黑色24号字',
                        style: new TextStyle(
                            fontSize: 24,
                            color: const Color(0xffff0000),
                            decoration: TextDecoration.underline
                        )
                    )
                ],
            )
        );
    }
}