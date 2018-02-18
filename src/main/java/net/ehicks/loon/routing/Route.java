package net.ehicks.loon.routing;

import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Repeatable(Routes.class)
public @interface Route
{
    String tab1();
    String tab2();
    String tab3();
    String action();
}
