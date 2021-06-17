import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:kampus_sggw/screens/settings_screen/settings_screen_widgets/change_language_widget.dart';
import 'package:kampus_sggw/screens/settings_screen/settings_screen_widgets/change_theme_widget.dart';
import 'package:kampus_sggw/translations/locale_keys.g.dart';
import 'package:easy_localization/easy_localization.dart';

class SettingsCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
            LocaleKeys.settings.tr(),
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.headline3
        ),
        backgroundColor: Theme.of(context).bannerTheme.backgroundColor,
      ),
      body : ListView(
        padding: EdgeInsets.zero,
        children: [
          ListTile(
            title: Text(
              LocaleKeys.dark_mode.tr(),
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.subtitle1,
            ),
            subtitle: Column(
              children: [
                ChangeThemeWidget(),
              ],
            ),
          ),
          ListTile(
            title: Text(
              LocaleKeys.language.tr(),
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.subtitle1,
            ),
            subtitle: Column(
              children: [
                ChangeLanguageWidget(),
              ],
            ),
          ),
        ],
      ),
    );
  }
}