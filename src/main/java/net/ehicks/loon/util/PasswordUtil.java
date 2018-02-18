package net.ehicks.loon.util;

import org.apache.shiro.authc.credential.DefaultPasswordService;
import org.apache.shiro.authc.credential.PasswordService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class PasswordUtil
{
    private static final Logger log = LoggerFactory.getLogger(PasswordUtil.class);
    private static int cryptoIterations = 200_000;

    public static String digestPassword(String password)
    {
        long start = System.currentTimeMillis();

        try
        {
            PasswordService passwordService = new DefaultPasswordService();
            String digested = passwordService.encryptPassword(password);

            log.debug("{} sha-256 iterations in {} ms", cryptoIterations, (System.currentTimeMillis() - start));
            return digested;
        }
        catch (Exception e)
        {
            log.error(e.getMessage(), e);
        }
        return null;
    }
}
